import axios from "axios";

export async function sendStackingProposal(baseUrl: string, hub: string, orderIds: string[]) {
    const orderIdString = orderIds.join(",");
    const url = `${baseUrl}/test/proposals?hub=${hub}&order_ids=${orderIdString}`;
    return axios.put(url);
}

export async function fetchStackState(baseUrl: string, hub: string) {
    const url = `${baseUrl}/state?hub=${hub}`;
    return axios.get(url);
}
