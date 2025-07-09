import {Client, createClient} from "@commercetools/sdk-client-v2";
import {ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient} from "@commercetools/platform-sdk";
import { readAppConfig} from "../../utils.js";
import fetch from "node-fetch";

let config: any;
let CT_AUTH_URL: string;
let CT_API_URL: string;
let projectKey: string;
let isInitialized = false;

let api: ByProjectKeyRequestBuilder | null = null;
let ctpClient: Client | null = null;

export async function ensureInitialized() {
    if (!isInitialized) {
        config = await readAppConfig();
        CT_AUTH_URL = config.CTAuthUrl;
        CT_API_URL = config.CTApiUrl;
        projectKey = process.env.CT_PROJECT_KEY as string;
        isInitialized = true;
    }
}

async function createClientWithMiddlewares() {
    await ensureInitialized();

    // Import CommonJS modules with type assertions
    const middlewareAuth = await import("../utils/commercetools-middleware.cjs") as any;
    const middlewareHttp = await import("../utils/commercetools-middleware-http.cjs") as any;
    
    const { createAuthMiddlewareForClientCredentialsFlow } = middlewareAuth.default;
    const { createHttpMiddleware } = middlewareHttp.default;


    const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
        host: CT_AUTH_URL,
        projectKey,
        credentials: {
            clientId: process.env.CT_CLIENT_ID!,
            clientSecret: process.env.CT_CLIENT_SECRET!,
        },
        scopes: [`manage_orders:${projectKey}`, `view_states:${projectKey}`],
        fetch,
    });

    const httpMiddleware = createHttpMiddleware({host: CT_API_URL, fetch});

    return createClient({middlewares: [authMiddleware, httpMiddleware]});
}

export async function ensureClientAndApi() {
    if (!ctpClient || !api) {
        ctpClient = await createClientWithMiddlewares();
        api = createApiBuilderFromCtpClient(ctpClient).withProjectKey({projectKey});
    }
}

export {api, ctpClient};