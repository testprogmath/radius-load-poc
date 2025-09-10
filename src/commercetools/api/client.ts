import { config } from "dotenv";
import fetch from "node-fetch";
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/ts-client";
import {
  createApiBuilderFromCtpClient,
  type ByProjectKeyRequestBuilder,
} from '@commercetools/platform-sdk';

import { readAppConfig } from "../../utils.js";

config({ override: true, quiet: true });

let api: ByProjectKeyRequestBuilder | null = null;
let isInitialized = false;

let CT_AUTH_URL: string;
let CT_API_URL: string;
let projectKey: string;

export async function ensureInitialized() {
  if (!isInitialized) {
    const cfg = await readAppConfig();

    CT_AUTH_URL = cfg.CTAuthUrl;
    CT_API_URL = cfg.CTApiUrl;
    projectKey = cfg.CTProjectKey ?? "flink-staging";

    isInitialized = true;
  }
}

export async function ensureClientAndApi() {
  await ensureInitialized();

  if (!api) {
    console.debug("[CT Client] Initializing new SDK client...");

    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: CT_AUTH_URL,
      projectKey: projectKey,
      credentials: {
        clientId: process.env.CT_CLIENT_ID!,
        clientSecret: process.env.CT_CLIENT_SECRET!,
      },
      scopes: [
        `manage_orders:${projectKey}`,
        `view_states:${projectKey}`,
      ],
      httpClient: fetch,
    };

    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: CT_API_URL,
      httpClient: fetch,
      timeout: 15_000,
    };

    const ctpClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    api = createApiBuilderFromCtpClient(ctpClient).withProjectKey({projectKey});

    console.debug("[CT Client] API instance created!");
  }
}

export { api, projectKey };
