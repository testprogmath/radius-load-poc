import axios from "axios";
import {Hubs} from "../shared/hubs.js";
import { readAppConfig } from "../utils.js";

export class Auth0Api {
    public async getToken(hubSlug: string) {

        const hubInfo = Hubs[hubSlug];
        if (!hubInfo) {
            throw new Error(`Hub information for '${hubSlug}' not found. Please check the hubSlug. If it's correct, contact the author of this tool: https://goflink.slack.com/team/U04RCKMB6JK`);
        }

        try {
            const cfg = await readAppConfig();
            const tokenEndpoint = `https://${cfg.auth0Domain}/oauth/token`;
            const response = await axios.post(tokenEndpoint, {
                grant_type: "password",
                username: hubInfo.email,
                password: hubInfo.password,
                client_id: "FK1VF8wZh5qQe5rAbb3NJAjEbZQJGX20",
                client_secret: "K_Xpa0ALio_5Y7qVgBRMm8PmnStzivLPUGZY61FJGGL5hPN99_U_3UIZcYVZxsOm",
                audience: "https://api.staging.goflink.com"
            }, {
                headers: {
                    'Content-Type': 'application/json'
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
