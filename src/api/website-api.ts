import {readAppConfig} from "../utils.js";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config({ override: true, quiet: true });

let config: any;
let identityUrl: string;
let identityKey: string;

let isInitialized = false;

async function ensureInitialized() {
    if (!isInitialized) {
        config = await readAppConfig();
        identityUrl = config.identityToolkitUrl;
        identityKey = process.env.IDENTITY_KEY!;

        if (!identityKey) {
            throw new Error("IDENTITY_KEY is not set in the environment variables.");
        }

        isInitialized = true;
    }
}

export async function authorizeInStore(email: string, password: string) {
    await ensureInitialized();

    try {
        const response = await axios.post(
            `${identityUrl}/v1/accounts:signInWithPassword`,
            {
                returnSecureToken: true,
                email: email,
                password: password,
            },
            {
                params: {
                    key: identityKey,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error signing in:", error.message);
        return null;
    }
}
