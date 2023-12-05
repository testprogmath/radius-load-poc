/* eslint-disable */
/* tslint:disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {CartRequest} from "./objects/cart-request";

/** Address represents the details of a shipping and/or billing address */
export interface Address {
    address_id?: string;
    building_location?: string;
    building_type?: string;
    city?: string;
    company_name?: string;
    country?: string;
    first_name?: string;
    floor_number?: string;
    house_number?: string;
    id?: string;
    last_name?: string;
    name_on_doorbell?: string;
    phone?: string;
    postal_code?: string;
    street_address_1?: string;
    street_address_2?: string;
    tag?: string;
}

/** AddressV3 represents the details of a shipping and/or billing address */
export interface AddressV3 {
    addressId?: string;
    buildingLocation?: string;
    buildingType?: string;
    city?: string;
    companyName?: string;
    country?: string;
    firstName?: string;
    floorNumber?: string;
    houseNumber?: string;
    id?: string;
    lastName?: string;
    nameOnDoorbell?: string;
    phone?: string;
    postalCode?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    tag?: string;
}

/** Amount encompasses amount details */
export interface Amount {
    /** Currency is alpha-3 codes from ISO 3166: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 */
    currency?: string;
    /**
     * value is the Amount in the minimum units
     * @format int64
     */
    value?: number;
}

/** Cart is the Flink representation of a Cart */
export interface Cart {
    clickAndCollect?: boolean;
    id?: string;
    lines?: LineItem[];
    /** PriceBreakdown is the Flink representation of a PriceBreakdown for a Cart */
    priceBreakdown?: PriceBreakdown;
    /** Voucher is the Flink representation of a Voucher for a Cart */
    voucher?: Voucher;
}

/** CartOrder if the cart has been order this is the order that was created */
export interface CartOrder {
    id?: string;
    number?: string;
    state?: string;
}

/** CentPrice is a price representation using the currency's smallest unit */
export interface CentPrice {
    /** @format int64 */
    centAmount?: number;
    currency?: string;
}

/** CheckoutInStoreRequestPayload expected request payload for in-store checkout */
export interface CheckoutInStoreRequestPayload {
    /** Amount encompasses amount details */
    amount?: Amount;
}

/** CheckoutInStoreResponse response for successful in-store checkout request */
export interface CheckoutInStoreResponse {
    transaction_id?: string;
}

/** CheckoutRequestPayload expected request payload for cart checkout */
export interface CheckoutRequestPayload {
    /**
     * amount to be paid
     * @format double
     * @min 1
     */
    amount: number;
    /** payment token retrieved from payment gateway */
    token: string;
}

/** OrderCreateResponse is the response the client receives upon checkingout the cart */
export interface CheckoutResponseV1 {
    /** ConfirmationData is an Adyen specific field */
    confirmation_data?: string;
    /** ConfirmationNeeded is an Adyen specific field */
    confirmation_needed?: boolean;
    id?: string;
    number?: string;
    token?: string;
}

/** OrderCreateResponseV3 is the response the client receives upon checking out the cart */
export interface CheckoutResponseV3 {
    /** ConfirmationData is an Adyen specific field */
    confirmationData?: string;
    /** ConfirmationNeeded is an Adyen specific field */
    confirmationNeeded?: boolean;
    id?: string;
    number?: string;
    token?: string;
}

/** Coordinates ... */
export interface Coordinates {
    /** @format double */
    latitude?: number;
    /** @format double */
    longitude?: number;
}

/** CartCreateResponse is the response the clients get upon creating a cart */
export interface CreateCartResponseV1 {
    /** Cart is the full representation of a cart domain object (maps checkout object on the ecom side) */
    cart?: GetCartResponseV1;
    id?: string;
    /** PaymentGateway is a representation for the payment gateway that we support. Communicates payment tokens that the clients use for the tokenisation process */
    payment_gateway?: PaymentGateway;
    payment_gateways?: PaymentGateway[];
}

/** Customer is the Flink representation of a Customer */
export interface Customer {
    emailAddress?: string;
    firstName?: string;
    id?: string;
    lastName?: string;
    phoneNumber?: string;
}

/** ErrorResponse to marshal as jsJSON */
export interface ErrorResponse {
    /** ErrorResponseDetail inner code and message */
    error?: ErrorResponseDetail;
    /** ErrorResponseOrder optional if appropriate */
    order?: ErrorResponseOrder;
}

/** ErrorResponseDetail inner code and message */
export interface ErrorResponseDetail {
    code?: string;
    message?: string;
}

/** ErrorResponseOrder optional if appropriate */
export interface ErrorResponseOrder {
    id?: string;
    number?: string;
}

/** Fee represents a fee object */
export interface Fee {
    name?: string;
    /** CentPrice is a price representation using the currency's smallest unit */
    price?: CentPrice;
    type?: string;
}

/** GetCartResponse is the JSON model returned when user gets a cart */
export interface GetCartResponse {
    /** Cart is the Flink representation of a Cart */
    cart?: Cart;
    /** Customer is the Flink representation of a Customer */
    customer?: Customer;
    /** Order is the Flink representation of a Order */
    order?: Order;
}

/** Cart is the full representation of a cart domain object (maps checkout object on the ecom side) */
export interface GetCartResponseV1 {
    /** Address represents the details of a shipping and/or billing address */
    billing_address?: Address;
    click_and_collect?: boolean;
    delivery_coordinates?: Coordinates;
    delivery_tier_id?: string;
    /** Price is the price representation */
    discount?: Price;
    email?: string;
    /** HubSlug is the Hub that the cart is generated for. It should not be returned to clients. */
    hub_slug?: string;
    id?: string;
    lines?: Line[];
    /** CartOrder if the cart has been order this is the order that was created */
    order?: CartOrder;
    /** PaymentGateway is a representation for the payment gateway that we support. Communicates payment tokens that the clients use for the tokenisation process */
    payment_gateway?: PaymentGateway;
    /** Price is the price representation */
    recycling_deposit?: Price;
    /** Price is the price representation */
    rider_tip?: Price;
    /** Address represents the details of a shipping and/or billing address */
    shipping_address?: Address;
    shipping_method_id?: string;
    /** Price is the price representation */
    shipping_price?: Price;
    /** Price is the price representation */
    storage_fee?: Price;
    /** Price is the price representation */
    sub_total_price?: Price;
    timeslot_id?: string;
    /** Price is the price representation */
    total_price?: Price;
    /**
     * Version is CT specific history-like versioning, that will be implemented by the mobile later
     * @format int32
     */
    version?: number;
    voucher_code?: string;
}

/**
 * CartResponseV3 represents the v3 output struct of a cart.
 * It can be either a response at the root level or a nested field (in CartCreateResponse).
 * Changes from v1 (v2 is skipped/deprecated):
 * all money values are returned as integers (`cent_amount`)
 * fees are returned in a list
 * deposit and discount are only returned if populated (value != 0)
 */
export interface GetCartResponseV3 {
    /** AddressV3 represents the details of a shipping and/or billing address */
    billingAddress?: AddressV3;
    clickAndCollect?: boolean;
    deliveryCoordinates?: Coordinates;
    deliveryTierID?: string;
    /** CentPrice is a price representation using the currency's smallest unit */
    discount?: CentPrice;
    email?: string;
    fees?: Fee[];
    hubSlug?: string;
    id?: string;
    lines?: LineV3[];
    /** CartOrder if the cart has been order this is the order that was created */
    order?: CartOrder;
    /** CentPrice is a price representation using the currency's smallest unit */
    recyclingDeposit?: CentPrice;
    /** CentPrice is a price representation using the currency's smallest unit */
    riderTip?: CentPrice;
    /** AddressV3 represents the details of a shipping and/or billing address */
    shippingAddress?: AddressV3;
    shippingMethodID?: string;
    /** CentPrice is a price representation using the currency's smallest unit */
    subTotalPrice?: CentPrice;
    timeslotID?: string;
    /** CentPrice is a price representation using the currency's smallest unit */
    totalPrice?: CentPrice;
    /** @format int64 */
    version?: number;
    voucherCode?: string;
}

/** GetPaymentMethodsResponse is the model for payment-methods allowed to the customer */
export interface GetPaymentMethodsResponse {
    paymentMethods?: PaymentMethodsConfig;
    preferredMethods?: PreferredMethod[];
}

/** GetRiderTipsResponse is the model for country-level suggested rider tips */
export interface GetRiderTipsResponse {
    riderTips?: RiderTipResponse[];
}

export interface GetPaymentsStatusResponse {
    status: string;
    receipts: Receipt[];
}

interface Receipt {
    type: string;
    contents: Content[];
}

interface Content {
    style: string;
    endOfLineFlag: boolean;
    text: string;
}


/** Line represents a product once added to the cart and/or order */
export interface Line {
    id?: string;
    product_name?: string;
    product_sku?: string;
    /** @format int64 */
    quantity?: number;
    thumbnail?: string;
    /** Price is the price representation */
    total_price?: Price;
    /** Price is the price representation */
    unit_price?: Price;
    variant_id?: string;
}

/** LineItem is the Flink representation of a LineItem in a Cart */
export interface LineItem {
    /** @format int64 */
    quantity?: number;
    sku?: string;
}

/** LineV3 represents a product once added to the cart and/or order */
export interface LineV3 {
    id?: string;
    productName?: string;
    productSku?: string;
    /** @format int64 */
    quantity?: number;
    thumbnail?: string;
    /** Price is the price representation */
    totalPrice?: Price;
    /** Price is the price representation */
    unitPrice?: Price;
    variantId?: string;
}

/** Money is the Flink representation of Money */
export interface Money {
    /**
     * CentAmount is the amount in the minimum units
     * @format int64
     */
    centAmount?: number;
    /** Currency is alpha-3 codes from ISO 3166: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 */
    currency?: string;
}

/** Order is the Flink representation of a Order */
export interface Order {
    id?: string;
}

/** PaymentGateway is a representation for the payment gateway that we support. Communicates payment tokens that the clients use for the tokenisation process */
export interface PaymentGateway {
    /** ClientAPIKey is only provided if the gateway is Adyen */
    client_api_key?: string;
    /** Config is only provided if the gateway is Adyen */
    config?: string;
    /**
     * Name is the name of the payment provider.
     * @example "Adyen"
     */
    name?: string;
}

/** Price is the price representation */
export interface Price {
    /** @format double */
    amount?: number;
    currency?: string;
}

/** PriceBreakdown is the Flink representation of a PriceBreakdown for a Cart */
export interface PriceBreakdown {
    /** Money is the Flink representation of Money */
    discount?: Money;
    /** Money is the Flink representation of Money */
    recyclingDeposit?: Money;
    /** Money is the Flink representation of Money */
    riderTip?: Money;
    /** Money is the Flink representation of Money */
    shipping?: Money;
    /** Money is the Flink representation of Money */
    storageFee?: Money;
    /** Money is the Flink representation of Money */
    subTotal?: Money;
    /** Money is the Flink representation of Money */
    total?: Money;
}

/** RiderTipResponse represents a rider tip */
export interface RiderTipResponse {
    /** emoji to be rendered on the client */
    emoji?: string;
    /** Money is the Flink representation of Money */
    price: Money;
}

/** SetRiderTipResponseV2 is the JSON model returned when a tip is added on a cart */
export interface SetRiderTipResponseV2 {
    /** Cart is the Flink representation of a Cart */
    cart?: Cart;
}

/** SetRiderTipResponseV3 is the JSON model returned when a tip is added on a cart */
export interface SetRiderTipResponseV3 {
    /**
     * It can be either a response at the root level or a nested field (in CartCreateResponse).
     * Changes from v1 (v2 is skipped/deprecated):
     * all money values are returned as integers (`cent_amount`)
     * fees are returned in a list
     * deposit and discount are only returned if populated (value != 0)
     */
    cart?: GetCartResponseV3;
}

/** SetShippingMethodResponse is the JSON response sent when successfully completing the request */
export interface SetShippingMethodResponse {
    /** Cart is the Flink representation of a Cart */
    cart?: Cart;
}

/** SetShippingMethodResponseV3 is the JSON response sent when successfully completing the request */
export interface SetShippingMethodResponseV3 {
    /**
     * It can be either a response at the root level or a nested field (in CartCreateResponse).
     * Changes from v1 (v2 is skipped/deprecated):
     * all money values are returned as integers (`cent_amount`)
     * fees are returned in a list
     * deposit and discount are only returned if populated (value != 0)
     */
    cart?: GetCartResponseV3;
}

/** ShippingMethod ... */
export interface ShippingMethod {
    clickAndCollect?: boolean;
}

/** ShippingTier represents a shipping method tier */
export interface ShippingTier {
    /** Money is the Flink representation of Money */
    deliveryPrice: Money;
    /** Money is the Flink representation of Money */
    minimumOrderValue: Money;
}

/** ShippingTierV3 represents a shipping method tier */
export interface ShippingTierV3 {
    /** CentPrice is a price representation using the currency's smallest unit */
    deliveryPrice: CentPrice;
    /** CentPrice is a price representation using the currency's smallest unit */
    minimumOrderValue: CentPrice;
}

/** ShippingTiers is the model representing the Shipping Rate Tiers */
export interface ShippingTiers {
    deliveryTiers?: ShippingTier[];
}

/** ShippingTiersV3 is the model representing shipping rate tiers for the V3 endpoint */
export interface ShippingTiersV3 {
    deliveryTierId?: string;
    deliveryTiers?: ShippingTierV3[];
    shippingMethodId?: string;
}

/** V1ErrorResponse from an http request to augment the HTTP status code */
export interface V1ErrorResponse {
    /** Code specific error code */
    code?: string;
    /**
     * The error message
     * in:body
     * Field that is in error
     */
    field?: string;
    /** Message human-readable message */
    message?: string;
}

/** Voucher is the Flink representation of a Voucher for a Cart */
export interface Voucher {
    code?: string;
}

export interface PaymentMethodsConfig {
    apiKey?: string;
    config?: string;
}

export interface PreferredMethod {
    brand?: string;
    enforceSave?: boolean;
    type?: string;
}

/** riderTip is a http abstract representation of commercetools.TypedMoney interface */
export interface RiderTip {
    /**
     * CentAmount is the amount in the minimum units
     * @format int64
     */
    centAmount?: number;
    /** Currency is alpha-3 codes from ISO 3166: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3 */
    currency?: string;
}

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType} from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({securityWorker, secure, format, ...axiosConfig}: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({...axiosConfig, baseURL: axiosConfig.baseURL ?? ""});
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    public request = async <T = any, _E = any>({
                                                   secure,
                                                   path,
                                                   type,
                                                   query,
                                                   format,
                                                   body,
                                                   ...params
                                               }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = (format ?? this.format) ?? undefined;

        if (type === ContentType.FormData && body && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && typeof body !== "string") {
            body = JSON.stringify(body);
        }

        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? {"Content-Type": type} : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        });
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method ?? params2?.method;

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 ?? {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers ?? {}),
                ...(params2?.headers ?? {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }
}

/**
 * @title Cart API.
 * @version 0.0.1
 *
 * the purpose of the cart service is to offer an API to create, modify, and pay for carts.
 */
export class CartApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    v1 = {
        /**
         * @description Creates a cart
         *
         * @tags v1-cart
         * @name CreateCartV1
         * @request POST:/v1/cart
         * @deprecated
         */
        createCartV1: (params: RequestParams = {}) =>
            this.request<CreateCartResponseV1, any>({
                path: `/v1/cart`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves all information related to cart
         *
         * @tags v1-cart
         * @name GetCartV1
         * @request GET:/v1/cart/{id}
         * @deprecated
         */
        getCartV1: (id: string, params: RequestParams = {}) =>
            this.request<GetCartResponseV1, any>({
                path: `/v1/cart/${id}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description Updates cart with mutable information
         *
         * @tags v1-cart
         * @name UpdateCartV1
         * @request PUT:/v1/cart/{id}
         * @deprecated
         */
        updateCartV1: (id: string, params: RequestParams = {}) =>
            this.request<GetCartResponse, any>({
                path: `/v1/cart/${id}`,
                method: "PUT",
                format: "json",
                ...params,
            }),

        /**
         * @description Attach a payment to the cart and fulfills the cart - returns an order
         *
         * @tags v1-payment
         * @name CheckoutV1
         * @request POST:/v1/cart/{id}/checkout
         */
        checkoutV1: (id: string, params: RequestParams = {}) =>
            this.request<CheckoutResponseV1, V1ErrorResponse>({
                path: `/v1/cart/${id}/checkout`,
                method: "POST",
                format: "json",
                ...params,
            }),


        /**
         * @description Attach a payment to the cart and fulfills the cart - returns an order
         *
         * @tags v1-payment
         * @name CheckoutDetailsV1
         * @request POST:/v1/cart/{id}/checkout/details
         */
        checkoutDetailsV1: (id: string, params: RequestParams = {}) =>
            this.request<CheckoutResponseV1, V1ErrorResponse>({
                path: `/v1/cart/${id}/checkout/details`,
                method: "POST",
                format: "json",
                ...params,
            }),
    };
    v2 = {
        /**
         * @description Retrieves all information related to cart
         *
         * @tags v2-cart
         * @name GetCart
         * @request GET:/v2/cart/{id}
         */
        getCart: (id: string, params: RequestParams = {}) =>
            this.request<GetCartResponse, any>({
                path: `/v2/cart/${id}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the payment methods for the cart
         *
         * @tags v2-payment
         * @name GetPaymentMethodsV2
         * @request POST:/v2/cart/{id}/payment-methods
         */
        getPaymentMethodsV2: (id: string, params: RequestParams = {}) =>
            this.request<GetPaymentMethodsResponse, any>({
                path: `/v2/cart/${id}/payment-methods`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags v2-cart
         * @name SetRiderTipV2
         * @request PUT:/v2/cart/{id}/rider-tips
         */
        setRiderTipV2: (id: string, riderTip: RiderTip, params: RequestParams = {}) =>
            this.request<SetRiderTipResponseV2, ErrorResponse>({
                path: `/v2/cart/${id}/rider-tips`,
                method: "PUT",
                body: riderTip,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags v2-cart
         * @name SetShippingMethodV2
         * @request PUT:/v2/cart/{id}/shipping-method
         */
        setShippingMethodV2: (id: string, ShippingMethod: ShippingMethod, params: RequestParams = {}) =>
            this.request<SetShippingMethodResponse, ErrorResponse>({
                path: `/v2/cart/${id}/shipping-method`,
                method: "PUT",
                body: {
                    clickAndCollect: ShippingMethod.clickAndCollect === true,
                },
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the shipping methods for the country code
         *
         * @tags v2-cart
         * @name GetShippingTiersV2
         * @request GET:/v2/cart/delivery-tiers/{countryCode}
         */
        getShippingTiersV2: (countryCode: string, params: RequestParams = {}) =>
            this.request<ShippingTiers, any>({
                path: `/v2/cart/delivery-tiers/${countryCode}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the suggested rider tips for the country code
         *
         * @tags v2-cart
         * @name GetRiderTipsV2
         * @request GET:/v2/cart/rider-tips/{countryCode}
         */
        getRiderTipsV2: (countryCode: string, params: RequestParams = {}) =>
            this.request<GetRiderTipsResponse, any>({
                path: `/v2/cart/rider-tips/${countryCode}`,
                method: "GET",
                format: "json",
                ...params,
            }),
    };
    v3 = {
        /**
         * @description Creates a cart
         *
         * @tags v3-cart
         * @name CreateCartV3
         * @request POST:/v3/cart
         */
        createCartV3: (body: CartRequest, params: RequestParams = {}) =>
            this.request<GetCartResponseV3, V1ErrorResponse>({
                path: `/v3/cart`,
                method: "POST",
                format: "json",
                body: body,
                ...params,
            }),

        /**
         * @description Retrieves all information related to cart
         *
         * @tags v3-cart
         * @name GetCartV3
         * @request GET:/v3/cart/{id}
         */
        getCartV3: (id: string, params: RequestParams = {}) =>
            this.request<GetCartResponseV3, V1ErrorResponse>({
                path: `/v3/cart/${id}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description Updates cart with mutable information
         *
         * @tags v3-cart
         * @name UpdateCartV3
         * @request PUT:/v3/cart/{id}
         */
        updateCartV3: (id: string, body: Object, params: RequestParams = {}) =>
            this.request<GetCartResponseV3, V1ErrorResponse | ErrorResponse>({
                path: `/v3/cart/${id}`,
                method: "PUT",
                format: "json",
                body: Object,
                ...params,
            }),
        /**
         * @description Performs the checkout for the in-store-payment flow
         *
         * @tags v3-in-store-payment
         * @name CheckoutInStoreRequest
         * @request POST:/v3/cart/{id}/checkout-in-store
         */
        checkoutInStoreRequest: (id: string, Body: CheckoutInStoreRequestPayload, params: RequestParams = {}) =>
            this.request<CheckoutInStoreResponse, ErrorResponseDetail>({
                path: `/v3/cart/${id}/checkout-in-store`,
                method: "POST",
                body: Body,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Attach a payment to the cart and fulfills the cart - returns an order
         *
         * @tags v3-payment
         * @name CheckoutV3
         * @request POST:/v3/cart/{id}/checkout
         */
        checkoutV3: (id: string, Body: CheckoutRequestPayload, params: RequestParams = {}) =>
            this.request<CheckoutResponseV3, V1ErrorResponse>({
                path: `/v3/cart/${id}/checkout`,
                method: "POST",
                body: Body,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * @description Attach a payment to the cart and fulfills the cart - returns an order
         *
         * @tags v3-payment
         * @name CheckoutDetailsV3
         * @request POST:/v3/cart/{id}/checkout/details
         */
        checkoutDetailsV3: (id: string, params: RequestParams = {}) =>
            this.request<CheckoutResponseV3, V1ErrorResponse>({
                path: `/v3/cart/${id}/checkout/details`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the payment methods for the cart
         *
         * @tags v3-payment
         * @name GetPaymentMethodsV3
         * @request POST:/v3/cart/{id}/payment-methods
         */
        getPaymentMethodsV3: (id: string, params: RequestParams = {}) =>
            this.request<GetPaymentMethodsResponse, any>({
                path: `/v3/cart/${id}/payment-methods`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags v3-cart
         * @name SetRiderTipV3
         * @request PUT:/v3/cart/{id}/rider-tips
         */
        setRiderTipV3: (id: string, riderTip: RiderTip, params: RequestParams = {}) =>
            this.request<SetRiderTipResponseV3, ErrorResponse>({
                path: `/v3/cart/${id}/rider-tips`,
                method: "PUT",
                body: riderTip,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags v3-cart
         * @name SetShippingMethodV3
         * @request PUT:/v3/cart/{id}/shipping-method
         */
        setShippingMethodV3: (id: string, ShippingMethod: ShippingMethod, params: RequestParams = {}) =>
            this.request<SetShippingMethodResponseV3, ErrorResponse>({
                path: `/v3/cart/${id}/shipping-method`,
                method: "PUT",
                body: ShippingMethod,
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the shipping methods for the country code
         *
         * @tags v3-cart
         * @name GetShippingTiersV3
         * @request GET:/v3/cart/delivery-tiers/{countryCode}
         */
        getShippingTiersV3: (countryCode: string, params: RequestParams = {}) =>
            this.request<ShippingTiersV3, any>({
                path: `/v3/cart/delivery-tiers/${countryCode}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the suggested rider tips for the country code
         *
         * @tags v3-cart
         * @name GetRiderTipsV3
         * @request GET:/v3/cart/rider-tips/{countryCode}
         */
        getRiderTipsV3: (countryCode: string, params: RequestParams = {}) =>
            this.request<GetRiderTipsResponse, any>({
                path: `/v3/cart/rider-tips/${countryCode}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        getPaymentStatusInStore: (id: string, params: RequestParams = {}) =>
            this.request<GetPaymentsStatusResponse, any>({
                path: `/v3/cart/${id}/payment-status-in-store`,
                method: "GET",
                format: "json",
                ...params
            })
    };
}
