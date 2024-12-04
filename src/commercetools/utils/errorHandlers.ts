import {AxiosError} from "axios";

export function handleError(error: unknown): void {
    if (error instanceof AxiosError) {
        console.error("Network error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
    } else if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
    } else {
        console.error("An unknown error occurred:", error);
    }
}

export async function handleConcurrentModificationError(error: any, retryCallback: () => Promise<void>, maxRetries = 3): Promise<void> {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            if (error.message?.includes("ConcurrentModification")) {
                console.log("Concurrent modification detected. Retrying...");
                await retryCallback();
                return;
            } else {
                throw error;
            }
        } catch (retryError) {
            retries++;
            if (retries >= maxRetries) {
                console.error(`Failed after ${maxRetries} retries.`);
                throw retryError;
            }
        }
    }
}

export function logUnknownError(error: unknown): void {
    if (error instanceof Error) {
        console.error("Error:", error.message);
    } else {
        console.error("An unknown error occurred:", error);
    }
}