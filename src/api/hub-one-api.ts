import {ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject, from} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import {Auth0Api} from "./auth0-api";
import {endPickingMutation, START_PICKING_ORDER_MUTATION} from "./graphql/mutations/order";

export class HubOneApi {
    private client: ApolloClient<NormalizedCacheObject>;
    private hubSlug: string | undefined;

    constructor(private readonly auth0Api: Auth0Api) {
        const httpLink = new HttpLink({
            uri: 'https://api.staging.goflink.com/hub-one-core/hub-one-core/graphql',
        });

        const authLink = setContext(async (_, { headers }) => {
            if (!this.hubSlug) {
                throw new Error("Hub slug is not set. Please set the hub slug before making requests.");
            }
            const token = await this.auth0Api.getToken(this.hubSlug);
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : "",
                }
            };
        });

        this.client = new ApolloClient({
            link: from([authLink, httpLink]),
            cache: new InMemoryCache(),
        });
    }

    public setHubSlug(hubSlug: string) {
        this.hubSlug = hubSlug;
    }

    public getClient(): ApolloClient<NormalizedCacheObject> {
        return this.client;
    }

    public async startPickingOrder(orderNumber: string) {
        try {
            const response = await this.client.mutate({
                mutation: START_PICKING_ORDER_MUTATION,
                variables: { orderNumber },
            });

            return response.data;
        }
        catch (error: any) {
            if (error.graphQLErrors) {
                for (const graphQLError of error.graphQLErrors) {
                    if (graphQLError.message === 'Order state not eligible for picking') {
                        console.log("Order is not eligible for picking");
                        throw new Error(graphQLError.message);
                    }
                }
            } else {
                console.error("An unknown error occurred:", error);
            }
        }
    }

    async endPickingOrder(orderNumber: string, missingItems: [], containersIds: string[], shelvesIds: string[]) {
        if (!this.client) {
            throw new Error("Apollo Client is not initialized.");
        }

        const response = await this.client.mutate({
            mutation: endPickingMutation,
            variables: {
                orderNumber,
                missingItems,
                containersIds,
                shelvesIds
            },
        });

        return response.data;
    }
}


