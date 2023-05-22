import {getConfigPath} from "../utils";
import axios from 'axios';
require('dotenv').config();


const config = getConfigPath();
const identityKey = process.env.IDENTITY_KEY;
const identityUrl = config.get("identityToolkitUrl");

export async function authorizeInStore(email: string, password: string) {
    try {
        const response = await axios.post(`${identityUrl}/v1/accounts:signInWithPassword`, {
            returnSecureToken: true,
            email: email,
            password: password,
        }, {
            params: {
                key: identityKey,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error signing in:', error.message);
        return null;
    }
}
