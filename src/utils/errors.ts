import { AxiosError } from "axios";

export function handleAxiosError(error: AxiosError): void {
    console.error("Oops, something went wrong:", error.message);
    if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
    } else {
        console.error("No response received from the server.");
    }
}