import axios from "axios";
import {Hubs} from "../shared/hubs.js";

export class Auth0Api {
    public async getToken(hubSlug: string) {

        const hubInfo = Hubs[hubSlug];
        if (!hubInfo) {
            throw new Error(`Hub information for '${hubSlug}' not found. Please check the hubSlug. If it's correct, contact the author of this tool: https://goflink.slack.com/team/U04RCKMB6JK`);
        }

        try {
            const response = await axios.post('https://auth.staging.goflink.com/oauth/token', {
                grant_type: "password",
                username: hubInfo.email,
                password: hubInfo.password,
                client_id: "FK1VF8wZh5qQe5rAbb3NJAjEbZQJGX20",
                client_secret: "K_Xpa0ALio_5Y7qVgBRMm8PmnStzivLPUGZY61FJGGL5hPN99_U_3UIZcYVZxsOm",
                audience: "https://api.staging.goflink.com"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'did=s%3Av0%3A1bdcb670-dbbf-11ee-8616-4d45586ae3fa.RdSlhJuo6h1kn0KqL4lkAZ6mUNk74gcfxGgeiwFnbJw; did_compat=s%3Av0%3A1bdcb670-dbbf-11ee-8616-4d45586ae3fa.RdSlhJuo6h1kn0KqL4lkAZ6mUNk74gcfxGgeiwFnbJw'
                }
            });
            if (response.data.access_token) {
                console.log('A token for the hub has been received!');
            }

            return response.data.access_token;
        } catch (error) {
            console.error('Error when receiving token:', error);
        }
    };
}