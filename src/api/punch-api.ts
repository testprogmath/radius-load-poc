import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

export interface UserLookupResponse {
    [key: string]: any;
}

export interface LoginResponse {
    status: string;
    manager: {
        e_id: string;
        e_name: string;
        e_badge_no: string;
        trials: string;
        passive: string;
        lock_status: string;
        password: string;
        r_name: string;
        r_id: string;
        q_name: string;
        q_id: string;
        valid_upto: string;
    };
}

export class TimepunchTooLateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TimepunchTooLateError';
    }
}

export class PunchApi {
    public readonly baseURL: string = "https://api.staging.goflink.com/last-mile/flunch/api/v1/webpunch";
    private axiosInstance: AxiosInstance;

    constructor() {
        const jar = new CookieJar();
        
        this.axiosInstance = wrapper(axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            jar: jar,
            withCredentials: true
        }));
    }

    /**
     * Login to establish session for webpunch operations
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);

        const response = await this.axiosInstance.post('/login', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*'
            }
        });

        console.log('Login successful, session established');
        
        return response.data;
    }

    /**
     * Find user by badge number
     */
    async findUserByBadge(customerId: string, unitId: string, badgeNumber: string): Promise<UserLookupResponse> {
        try {
            const url = `/user/customer/${customerId}/unit/${unitId}/badge/${badgeNumber}`;
            console.log(`Making request to: ${this.baseURL}${url}`);
            
            const response = await this.axiosInstance.get(url, {
                headers: {
                    'Accept': '*/*'
                }
            });

            return response.data;
        } catch (error: any) {
            console.log(`Error in findUserByBadge: ${error.message}`);
            if (error.response) {
                console.log(`Response status: ${error.response.status}`);
                console.log(`Response data:`, JSON.stringify(error.response.data, null, 2));
                console.log(`Request URL: ${this.baseURL}/user/customer/${customerId}/unit/${unitId}/badge/${badgeNumber}`);
            }
            throw error;
        }
    }

    /**
     * Execute punch action
     */
    async punch(restId: string, customerId: string, badgeNumber: string, action: 'PUNCH_IN' | 'PUNCH_OUT' | 'BREAK_IN', webcamImage?: string, leaveReason?: string): Promise<void> {
        try {
            const params = new URLSearchParams();
            params.append('rest_id', restId);
            params.append('customer_id', customerId);
            params.append('badge_number', badgeNumber);
            params.append('action', action);
            
            // Add current timestamp for the punch
            const now = new Date();
            params.append('punch_time', now.toISOString());
            
            if (webcamImage) {
                params.append('webcam_image', webcamImage);
            }
            
            if (leaveReason) {
                params.append('leave_reason', leaveReason);
            }

            const response = await this.axiosInstance.post('/punch', params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': '*/*'
                }
            });
        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data;
                if (error.response.status === 409) {
                    throw new Error('Punch has already been completed for this time period. No duplicate punch allowed.');
                } else if (error.response.status === 422) {
                    if (errorData.error === 'schedule not found') {
                        throw new Error('Cannot punch in: No active shift/schedule found for this employee at the current time. Please check if you have a scheduled shift.');
                    } else if (errorData.error === 'TIMEPUNCH_TOO_LATE_MISSING_REASON') {
                        throw new TimepunchTooLateError('Punch attempt is too late and requires a reason. You can force the punch by providing a reason.');
                    } else {
                        throw new Error(`Punch failed: ${errorData.error || 'Unknown error'}`);
                    }
                } else if (error.response.status === 400) {
                    console.log('400 Error details:', JSON.stringify(errorData, null, 2));
                    if (errorData.error === 'Invalid time interval') {
                        throw new Error('Invalid time interval: The punch time may be outside allowed hours or there may be no active shift scheduled. Please check if you have a scheduled shift for the current time.');
                    } else {
                        throw new Error('Invalid request. Please check your hub name and input data.');
                    }
                }
            }
            throw error;
        }
    }
}