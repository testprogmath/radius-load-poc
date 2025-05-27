import axios, { AxiosRequestConfig } from "axios";

export async function sendStackingProposal(
    baseUrl: string,
    hub: string,
    orderIds: string[],
    config?: AxiosRequestConfig
) {
    const orderIdString = orderIds.join(",");
    const url = `${baseUrl}/test/proposals?hub=${hub}&order_ids=${orderIdString}`;
    return axios.put(url, {}, config);
}

export async function fetchStackState(
    baseUrl: string,
    hub: string,
    config?: AxiosRequestConfig
) {
    const url = `${baseUrl}/state?hub=${hub}`;
    return axios.get(url, config);
}