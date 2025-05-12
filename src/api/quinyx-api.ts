import axios from "axios";
import {Buffer} from "buffer";
import { readAppConfig} from "../utils.js";
import {QuinyxGroup, QuinyxShiftType} from "../shared/enums.js";
import {formatDate} from "../utils/types.js";
import * as fs from "fs/promises";


const createShiftRequest = JSON.parse(
    // @ts-ignore
    await fs.readFile(new URL('./files/create_shift_request.json', import.meta.url), "utf-8")
);

let baseConfig: any;
let QUINYX_URL: string;

let isInitialized = false;

async function ensureInitialized() {
    if (!isInitialized) {
        baseConfig = await readAppConfig();
        QUINYX_URL = baseConfig.quinyxUrl;
        isInitialized = true;
    }
}

interface Cookies {
    api_session?: string;
    qshard?: string;
    SESSIONID?: string;

    [key: string]: string | undefined;
}

export class QuinyxApi {
    private cookies: Cookies = {};
    private userId: number | null = null;

    public getUserId(): number | null {
        return this.userId;
    }

    public async userLogin(username: string, password: string): Promise<any> {
        await ensureInitialized();
        const url = `${QUINYX_URL}/login`;
        const base64Credentials = Buffer.from(`${username}:${password}`).toString("base64");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Basic ${base64Credentials}`,
        };

        try {
            console.log(`Making request to ${url}`);
            const response = await axios.get(url, {
                headers,
                data: {
                    grantType: "password",
                    username,
                    password,
                },
            });

            if (response.data?.id) {
                this.userId = response.data.id;
            }

            const setCookieHeader = response.headers['set-cookie'];

            if (setCookieHeader) {
                setCookieHeader.forEach((cookie: string) => {
                    const [name, value] = cookie.split(";")[0].split("=");
                    this.cookies[name] = value;
                });
            }

            return response.data;
        } catch (error) {
            throw new Error(`Failed to login: ${error}`);
        }
    }

    public async createShift(groupId: QuinyxGroup, beginDateTime: Date, endDateTime: Date, shiftType: QuinyxShiftType): Promise<any> {
        await ensureInitialized();
        const url = `${QUINYX_URL}/v1/schedule/shifts?ignoreValidationRules=true&serializeAs=COMPACT`;
        const headers = {
            'cookie': `api_session=${this.cookies['api_session']}; qshard=${this.cookies['qshard']}; SESSIONID=${this.cookies['SESSIONID']}`,
        };
        const data = {
            ...createShiftRequest,
            employeeId: this.getUserId(),
            begin: beginDateTime,
            end: endDateTime,
            shiftTypeId: shiftType,
            groupId: groupId.valueOf(),
        };

        try {
            console.log(`Sending POST request to ${url}`);
            console.log(`with data ${JSON.stringify(data)}`);
            const response = await axios.post(url, data, {headers});
            return response.data;
        } catch (error: any) {
            console.log(error.response?.status, error.response?.data);
            throw new Error(`Failed to get schedule shifts: ${error}`);
        }
    }

    public async getGroups(): Promise<any> {
        await ensureInitialized();
        const url = `${QUINYX_URL}/v1/organisation/groups`;
        const headers = {
            'cookie': `api_session=${this.cookies['api_session']}; qshard=${this.cookies['qshard']}; SESSIONID=${this.cookies['SESSIONID']}`,
        };

        try {
            const response = await axios.get(url, {headers});
            return response.data;
        } catch (error: any) {
            console.log(error.response?.status, error.response?.data);
            throw new Error(`Failed to get groups: ${error}`);
        }
    }

    public async findEmployee(searchQuery: string, groupId: number): Promise<any> {
        await ensureInitialized();
        const url = `${QUINYX_URL}/v1/employee/by-group/${groupId}`;
        const headers = {
            'cookie': `api_session=${this.cookies['api_session']}; qshard=${this.cookies['qshard']}; SESSIONID=${this.cookies['SESSIONID']}`,
        };

        const params = {
            'includeFutureRoles': true,
            'offset': 0,
            'page': 1,
            'resultSize': 10,
            'search': searchQuery,
            'showExpiredAgreements': true
        };

        console.log(`Sending request to URL: ${url}`);
        try {

            const response = await axios.get(url, {
                headers,
                params
            });

            if (response.status === 200 && response.data) {
                return response.data.employees[0];

            } else {
                console.error(`Error: Got ${response.status} from API`);
            }

        } catch (error) {
            throw new Error(`Failed to find employee: ${error}`);
        }
    }

    public async getAllShiftsByDateForUser(groupId: number, startDate: Date): Promise<any> {
        await ensureInitialized();

        // EndDate will be next day
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);


        const url = `${QUINYX_URL}/v2/schedule/shifts/by-group/${groupId}?endDate=${formatDate(endDate)}&startDate=${formatDate(startDate)}`;
        const headers = {
            'cookie': `api_session=${this.cookies['api_session']}; qshard=${this.cookies['qshard']}; SESSIONID=${this.cookies['SESSIONID']}`,

        };

        try {
            const response = await axios.get(url, {headers});
            const filteredShifts = response.data.filter((shift: any) => shift.employeeId === this.userId);
            console.log(filteredShifts);
            return filteredShifts.map((shift: any) => shift.id);
        } catch (error) {
            throw new Error(`Failed to get shifts: ${error}`);
        }
    }

    public async deleteShift(shiftId: number, groupId: number): Promise<void> {
        await ensureInitialized();
        const url = `${QUINYX_URL}/v1/schedule/shifts/${shiftId}/groups/${groupId}?deletePunches=true&ignoreValidationRules=true`;

        const headers = {
            'cookie': `api_session=${this.cookies['api_session']}; qshard=${this.cookies['qshard']}; SESSIONID=${this.cookies['SESSIONID']}`,
        };

        try {
            await axios.delete(url, {headers});
            console.log(`Successfully deleted shift with ID ${shiftId}`);
        } catch (error) {
            throw new Error(`Failed to delete shift: ${error}`);
        }
    }

}
