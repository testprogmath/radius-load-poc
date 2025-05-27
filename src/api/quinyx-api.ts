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

interface EmployeeInfo {
    employeeId: number;
    agreementId: number;
}

const QUINYX_ENDPOINTS = {
    login: () => `/login`,
    groups: () => `/v1/organisation/groups`,
    employeesByGroup: (groupId: number) => `/v1/employee/by-group/${groupId}`,
    createShift: () => `/v1/schedule/shifts?ignoreValidationRules=true&serializeAs=COMPACT`,
    deleteShift: (shiftId: number, groupId: number) =>
        `/v1/schedule/shifts/${shiftId}/groups/${groupId}?deletePunches=true&ignoreValidationRules=true`,
    shiftsByDate: (groupId: number, start: string, end: string) =>
        `/v2/schedule/shifts/by-group/${groupId}?startDate=${start}&endDate=${end}`
};

function buildUrl(path: string): string {
    return `${QUINYX_URL}${path}`;
}

export class QuinyxApi {
    private cookies: Cookies = {};
    private userId: number | null = null;

    private getAuthHeaders(): Record<string, string> {
        return {
            'cookie': `api_session=${this.cookies['api_session']}; qshard=${this.cookies['qshard']}; SESSIONID=${this.cookies['SESSIONID']}`,
        };
    }

    public getUserId(): number | null {
        return this.userId;
    }

    public async userLogin(username: string, password: string): Promise<any> {
        await ensureInitialized();
        const url = buildUrl(QUINYX_ENDPOINTS.login());
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
    public parseEmployeeInfo(employee: any): EmployeeInfo {
        if (!employee || !employee.id || !employee.agreements) {
            throw new Error("Invalid employee object");
        }

        const mainAgreement = employee.agreements.find((a: any) => a.mainAgreement);
        if (!mainAgreement) {
            throw new Error("No main agreement found for employee");
        }

        return {
            employeeId: employee.id,
            agreementId: mainAgreement.id
        };
    }

    public async createShift(groupId: QuinyxGroup, beginDateTime: Date, endDateTime: Date, shiftType: QuinyxShiftType, employeeId: number, agreementId: number): Promise<any> {
        await ensureInitialized();
        const url = buildUrl(QUINYX_ENDPOINTS.createShift());
        const headers = this.getAuthHeaders();
        const data = {
            ...createShiftRequest,
            employeeId: employeeId,
            begin: beginDateTime,
            end: endDateTime,
            shiftTypeId: shiftType,
            groupId: groupId.valueOf(),
            agreementId: agreementId
        };

        try {
            console.log(`Sending POST request to ${url}`);
            const response = await axios.post(url, data, {headers});
            return response.data;
        } catch (error: any) {
            console.log(error.response?.status, error.response?.data);
            throw new Error(`Failed to get schedule shifts: ${error}`);
        }
    }

    public async getGroups(): Promise<any> {
        await ensureInitialized();
        const url = buildUrl(QUINYX_ENDPOINTS.groups());
        const headers = this.getAuthHeaders();

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
        const url = buildUrl(QUINYX_ENDPOINTS.employeesByGroup(groupId));
        const headers = this.getAuthHeaders();

        const params = {
            'includeFutureRoles': true,
            'offset': 0,
            'page': 1,
            'resultSize': 10,
            'search': searchQuery,
            'showExpiredAgreements': true
        };

        console.log(`Sending request to URL: ${url} with params: ${JSON.stringify(params)}`);
        try {
            const response = await axios.get(url, {
                headers,
                params
            });

            if (response.data?.employees?.length > 0) {
                console.log(JSON.stringify(response.data));
                return response.data.employees[0];
            }

            console.warn(`⚠️ No exact match found on first page, iterating over all employees...`);
            return await this.findEmployeeByIteratingPages(searchQuery, groupId);

        } catch (error) {
            throw new Error(`Failed to find employee: ${error}`);
        }
    }

    public async findEmployeeByIteratingPages(searchQuery: string, groupId: number): Promise<any> {
        await ensureInitialized();

        const url = buildUrl(QUINYX_ENDPOINTS.employeesByGroup(groupId));
        const headers = this.getAuthHeaders();

        let offset = 0;
        const resultSize = 100;
        let totalCount = Infinity;

        while (offset < totalCount) {
            const params = {
                includeFutureRoles: true,
                offset,
                page: 1,
                resultSize,
                showExpiredAgreements: true
            };

            console.log(`Fetching employees from offset ${offset}`);
            try {
                const response = await axios.get(url, {
                    headers,
                    params
                });

                const { employees, pagination } = response.data;

                totalCount = pagination.totalCount || 0;

                const exactMatch = employees.find((e: any) =>
                    e.badgeNumber === searchQuery || e.email === searchQuery
                );

                if (exactMatch) {
                    console.log(`✅ Found exact match: ${exactMatch.email || exactMatch.badgeNumber}`);
                    return exactMatch;
                }

                offset += resultSize;
            } catch (error) {
                throw new Error(`Failed to search employee in pages: ${error}`);
            }
        }

        console.warn(`⚠️ No employee found with exact match for: ${searchQuery}`);
        return null;
    }

    public async getAllShiftsByDateForUser(groupId: number, startDate: Date): Promise<any> {
        await ensureInitialized();

        // EndDate will be next day
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);


        const url = buildUrl(QUINYX_ENDPOINTS.shiftsByDate(groupId, formatDate(startDate), formatDate(endDate)));
        const headers = this.getAuthHeaders();

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
        const url = buildUrl(QUINYX_ENDPOINTS.deleteShift(shiftId, groupId));

        const headers = this.getAuthHeaders();

        try {
            await axios.delete(url, {headers});
            console.log(`Successfully deleted shift with ID ${shiftId}`);
        } catch (error) {
            throw new Error(`Failed to delete shift: ${error}`);
        }
    }
}
