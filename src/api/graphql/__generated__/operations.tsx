import * as Types from "./schemas";

export type CreateDeliveryCheckinForHubMutationVariables = Types.Exact<{
    input: Types.NewDeliveryCheckinInput;
}>;

export type CreateDeliveryCheckinForHubMutation = {
    __typename?: "Mutation";
    createDeliveryCheckinForHub: {
        __typename?: "DeliveryCheckinResponse";
        deliveryCheckin: { __typename?: "IDeliveryCheckin"; id: string };
    };
};

export type GetDeliveryCheckInsForHubDeliveredTodayQueryVariables = Types.Exact<{
    [key: string]: never;
}>;

export type GetDeliveryCheckInsForHubDeliveredTodayQuery = {
    __typename?: "Query";
    getDeliveryCheckInsForHubDeliveredToday: {
        __typename?: "GetDeliveryCheckinsResponse";
        deliveryCheckins: Array<{
            __typename?: "IDeliveryCheckin";
            categories: Array<Types.DeliveryCheckinProductCategory>;
            delivered_at: string;
            id: string;
            supplier: { __typename?: "ISupplierSummary"; id: string; name: string };
        }>;
    };
};

export type GetSuppliersForHubQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSuppliersForHubQuery = {
    __typename?: "Query";
    getSuppliersForHub: {
        __typename?: "GetSuppliersForHubResponse";
        suppliers: Array<{ __typename?: "ISupplier"; id: string; name: string; sortSequence: number }>;
    };
};

export type ClaimDeviceMutationVariables = Types.Exact<{
    input: Types.DeviceClaimInput;
}>;

export type ClaimDeviceMutation = {
    __typename?: "Mutation";
    claimDevice: { __typename?: "DeviceClaim"; employeeId: string };
};

export type ForceClaimDeviceMutationVariables = Types.Exact<{
    input: Types.DeviceClaimInput;
}>;

export type ForceClaimDeviceMutation = {
    __typename?: "Mutation";
    forceClaimDevice: { __typename?: "DeviceClaim"; employeeId: string };
};

export type UnclaimDeviceMutationVariables = Types.Exact<{
    input: Types.DeviceClaimInput;
}>;

export type UnclaimDeviceMutation = {
    __typename?: "Mutation";
    unclaimDevice: { __typename?: "MutationResponse"; message: string };
};

export type IdentifyEmployeeMutationVariables = Types.Exact<{
    badgeNo: Types.Scalars["String"];
}>;

export type IdentifyEmployeeMutation = {
    __typename?: "Mutation";
    identifyEmployee: {
        __typename?: "HubOneEmployee";
        firstName: string;
        lastName: string;
        badgeNo: string;
        isActive?: boolean | null;
        roles: Array<string>;
    };
};

export type StartInboundingMutationVariables = Types.Exact<{
    input: Types.StartInboundingInput;
}>;

export type StartInboundingMutation = {
    __typename?: "Mutation";
    startInbounding: { __typename?: "StartInboundingResponse"; timestamp: any };
};

export type EndInboundingMutationVariables = Types.Exact<{
    input: Types.EndInboundingInput;
}>;

export type EndInboundingMutation = {
    __typename?: "Mutation";
    endInbounding: { __typename?: "EndInboundingResponse"; timestamp: any };
};

export type GetNonScannableCategoriesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetNonScannableCategoriesQuery = {
    __typename?: "Query";
    getNonScannableCategories: {
        __typename?: "NonScannableCategoriesV2Response";
        categories: Array<{
            __typename?: "CategoryV2";
            id: string;
            name: string;
            subcategories: Array<{
                __typename?: "SubcategoryV2";
                id: string;
                name: string;
                imageUrl?: string | null;
                productsCount: number;
            }>;
        }>;
    };
};

export type GetDespatchAdviceByRolliIdQueryVariables = Types.Exact<{
    input: Types.GetDespatchAdviceByRolliIdInput;
}>;

export type GetDespatchAdviceByRolliIdQuery = {
    __typename?: "Query";
    getDespatchAdviceByRolliID: {
        __typename?: "GetDespatchAdviceByRolliIDResponse";
        despatchAdvice: {
            __typename?: "DespatchAdvice";
            id: string;
            items: Array<{
                __typename?: "DespatchAdviceItem";
                handlingUnitSize: number;
                isTotalQuantityEstimate: boolean;
                skus: Array<string>;
                totalQuantity: number;
            }>;
        };
    };
};

export type GetProductsStockQueryVariables = Types.Exact<{
    input: Types.GetProductsInput;
}>;

export type GetProductsStockQuery = {
    __typename?: "Query";
    getProducts: {
        __typename?: "GetProductsResponse";
        products: Array<{
            __typename?: "IProduct";
            sku: string;
            inventoryEntry: {
                __typename?: "InventoryEntry";
                stock: { __typename?: "Stock"; shelf: number };
            };
        }>;
    };
};

export type GetProductsBySubcategoryV2QueryVariables = Types.Exact<{
    input: Types.GetProductsBySubcategoryInput;
}>;

export type GetProductsBySubcategoryV2Query = {
    __typename?: "Query";
    getProductsBySubcategoryV2: {
        __typename?: "GetProductsBySubcategoryResponse";
        products: Array<{
            __typename?: "IProduct";
            bio?: boolean | null;
            imageUrl?: string | null;
            name: string;
            sku: string;
            numberOfShelfFacings?: number | null;
            isShelvedInHandlingUnits?: boolean | null;
            countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            inventoryEntry: { __typename?: "InventoryEntry"; shelfNumber?: string | null };
            units: Array<{
                __typename?: "Unit";
                ean?: string | null;
                id: string;
                quantity: number;
                type: string;
            }>;
        }>;
    };
};

export type ValidateBbdCheckMutationVariables = Types.Exact<{
    input: Types.ValidateBbdCheckInput;
}>;

export type ValidateBbdCheckMutation = {
    __typename?: "Mutation";
    validateBBDCheck: { __typename?: "CheckMutationResponse"; success: boolean };
};

export type UpdateProductBbdMutationVariables = Types.Exact<{
    input: Types.UpdateProductBbdInput;
}>;

export type UpdateProductBbdMutation = {
    __typename?: "Mutation";
    updateProductBBD: { __typename?: "CheckMutationResponse"; success: boolean };
};

export type GetProductWithBbdTaskQueryVariables = Types.Exact<{
    sku: Types.Scalars["ID"];
}>;

export type GetProductWithBbdTaskQuery = {
    __typename?: "Query";
    getProduct: {
        __typename?: "IProduct";
        name: string;
        minDaysToBestBeforeDate?: number | null;
        sku: string;
        imageUrl?: string | null;
        bbd?: string | null;
        bio?: boolean | null;
        inventoryEntry: {
            __typename?: "InventoryEntry";
            shelfNumber?: string | null;
            stock: { __typename?: "Stock"; shelf: number };
        };
        countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
    };
};

export type ValidateEoyCheckMutationVariables = Types.Exact<{
    input: Types.ValidateEoyCheckInput;
}>;

export type ValidateEoyCheckMutation = {
    __typename?: "Mutation";
    validateEoyCheck: { __typename?: "CheckMutationResponse"; success: boolean };
};

export type ValidateFreshnessCheckMutationVariables = Types.Exact<{
    input: Types.ValidateFreshnessCheckInput;
}>;

export type ValidateFreshnessCheckMutation = {
    __typename?: "Mutation";
    validateFreshnessCheck: { __typename?: "CheckMutationResponse"; success: boolean };
};

export type RestockItemMutationVariables = Types.Exact<{
    input: Types.RestockItemWithSkuAndListIdInput;
}>;

export type RestockItemMutation = {
    __typename?: "Mutation";
    restockItem: { __typename?: "RestockingMutationResponse"; message: string };
};

export type DeletePrivateRestockingListMutationVariables = Types.Exact<{
    input: Types.PrivateListIdInput;
}>;

export type DeletePrivateRestockingListMutation = {
    __typename?: "Mutation";
    deletePrivateRestockingList: {
        __typename?: "DeletePrivateListResponse";
        message: string;
        success: boolean;
    };
};

export type RemoveItemFromRestockingPrivateListMutationVariables = Types.Exact<{
    input: Types.RestockItemWithSkuAndListIdInput;
}>;

export type RemoveItemFromRestockingPrivateListMutation = {
    __typename?: "Mutation";
    removeItemFromRestockingPrivateList: {
        __typename?: "RestockingMutationResponse";
        message: string;
    };
};

export type CreatePrivateRestockingListMutationVariables = Types.Exact<{
    input: Types.CreatePrivateRestockingListInput;
}>;

export type CreatePrivateRestockingListMutation = {
    __typename?: "Mutation";
    createPrivateRestockingList: { __typename?: "PrivateRestockingListResponse"; id: string };
};

export type SaveSkuToPublicRestockingListMutationVariables = Types.Exact<{
    input: Types.RestockingItemInput;
}>;

export type SaveSkuToPublicRestockingListMutation = {
    __typename?: "Mutation";
    saveSkuToPublicRestockingList: {
        __typename?: "SaveSkuToPublicRestockingListResponse";
        success: boolean;
    };
};

export type GetPrivateRestockingListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetPrivateRestockingListQuery = {
    __typename?: "Query";
    getPrivateRestockingList: {
        __typename?: "PrivateRestockingListResponse";
        id: string;
        restockingItems: Array<{
            __typename?: "RestockingItem";
            status: Types.RestockingItemStatus;
            sku: string;
            product?: {
                __typename?: "IProduct";
                sku: string;
                name: string;
                imageUrl?: string | null;
                bio?: boolean | null;
                numberOfShelfFacings?: number | null;
                isShelvedInHandlingUnits?: boolean | null;
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
                inventoryEntry: {
                    __typename?: "InventoryEntry";
                    shelfNumber?: string | null;
                    stock: { __typename?: "Stock"; shelf: number };
                };
            } | null;
        }>;
    };
};

export type SearchRestockingProductsByTextQueryVariables = Types.Exact<{
    searchProductsByTextInput: Types.SearchUnitsByTextInput;
}>;

export type SearchRestockingProductsByTextQuery = {
    __typename?: "Query";
    searchUnitsByText: {
        __typename?: "SearchUnitsByTextResponse";
        units: Array<{
            __typename?: "Unit";
            product: {
                __typename?: "IProduct";
                sku: string;
                imageUrl?: string | null;
                name: string;
                bio?: boolean | null;
                inventoryEntry: {
                    __typename?: "InventoryEntry";
                    shelfNumber?: string | null;
                    stock: { __typename?: "Stock"; shelf: number };
                };
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            };
        }>;
    };
};

export type GetPublicRestockingListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetPublicRestockingListQuery = {
    __typename?: "Query";
    getPublicRestockingList: {
        __typename?: "GetPublicRestockingListResponse";
        publicRestockingList: {
            __typename?: "PublicRestockingList";
            hubSlug: string;
            restockingItems: Array<{
                __typename?: "RestockingItem";
                sku: string;
                product?: {
                    __typename?: "IProduct";
                    sku: string;
                    imageUrl?: string | null;
                    name: string;
                    bio?: boolean | null;
                    countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
                    inventoryEntry: {
                        __typename?: "InventoryEntry";
                        shelfNumber?: string | null;
                        stock: { __typename?: "Stock"; shelf: number };
                    };
                } | null;
            }>;
        };
    };
};

export type ResolveEaNtoSkusQueryVariables = Types.Exact<{
    input: Types.SearchUnitsByEanInput;
}>;

export type ResolveEaNtoSkusQuery = {
    __typename?: "Query";
    searchUnitsByEan: {
        __typename?: "SearchUnitsByEanResponse";
        units: Array<{ __typename?: "Unit"; productSku: string }>;
    };
};

export type ValidateStockCheckMutationVariables = Types.Exact<{
    input: Types.ValidateStockCheckInput;
}>;

export type ValidateStockCheckMutation = {
    __typename?: "Mutation";
    validateStockCheck: { __typename?: "CheckMutationResponse"; success: boolean };
};

export type SearchProductsByEanQueryVariables = Types.Exact<{
    searchProductsByEanInput: Types.SearchUnitsByEanInput;
}>;

export type SearchProductsByEanQuery = {
    __typename?: "Query";
    searchUnitsByEan: {
        __typename?: "SearchUnitsByEanResponse";
        units: Array<{
            __typename?: "Unit";
            productSku: string;
            quantity: number;
            type: string;
            product: {
                __typename?: "IProduct";
                sku: string;
                imageUrl?: string | null;
                name: string;
                bio?: boolean | null;
                inventoryEntry: {
                    __typename?: "InventoryEntry";
                    shelfNumber?: string | null;
                    stock: { __typename?: "Stock"; shelf: number };
                };
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            };
        }>;
    };
};

export type GetProductsByShelfQueryVariables = Types.Exact<{
    input: Types.GetInventoryEntriesByShelfInput;
}>;

export type GetProductsByShelfQuery = {
    __typename?: "Query";
    getInventoryEntriesByShelf: {
        __typename?: "GetInventoryEntriesByShelfResponse";
        inventoryEntries: Array<{
            __typename?: "InventoryEntry";
            product?: {
                __typename?: "IProduct";
                imageUrl?: string | null;
                name: string;
                sku: string;
                bio?: boolean | null;
                inventoryEntry: {
                    __typename?: "InventoryEntry";
                    shelfNumber?: string | null;
                    stock: { __typename?: "Stock"; shelf: number };
                };
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            } | null;
        }>;
    };
};

export type SearchInventoryUnitsByTextQueryVariables = Types.Exact<{
    searchProductsByTextInput: Types.SearchUnitsByTextInput;
}>;

export type SearchInventoryUnitsByTextQuery = {
    __typename?: "Query";
    searchUnitsByText: {
        __typename?: "SearchUnitsByTextResponse";
        units: Array<{
            __typename?: "Unit";
            productSku: string;
            quantity: number;
            type: string;
            product: {
                __typename?: "IProduct";
                sku: string;
                imageUrl?: string | null;
                name: string;
                bio?: boolean | null;
                inventoryEntry: {
                    __typename?: "InventoryEntry";
                    shelfNumber?: string | null;
                    stock: { __typename?: "Stock"; shelf: number };
                };
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            };
        }>;
    };
};

export type CreateCheckMutationVariables = Types.Exact<{
    input: Types.CreateCheckInput;
}>;

export type CreateCheckMutation = {
    __typename?: "Mutation";
    createCheck: { __typename?: "CheckMutationResponse"; success: boolean };
};

export type UpdateProductStockByDeltaAndMultipleReasonsMutationVariables = Types.Exact<{
    updateProductStockByDeltaAndMultipleReasonsInput: Types.UpdateProductStockByDeltaAndMultipleReasonsInput;
}>;

export type UpdateProductStockByDeltaAndMultipleReasonsMutation = {
    __typename?: "Mutation";
    updateProductStockByDeltaAndMultipleReasons: {
        __typename?: "UpdateProductStockByDeltaAndMultipleReasonsResponse";
        updateResults: Array<{ __typename?: "UpdateProductStockByDeltaResponse"; success: boolean }>;
    };
};

export type StartInventoryCheckMutationVariables = Types.Exact<{
    checkId: Types.Scalars["ID"];
}>;

export type StartInventoryCheckMutation = {
    __typename?: "Mutation";
    startCheck: { __typename?: "CheckMutationResponse"; success: boolean };
};

export type GetProductStockQueryVariables = Types.Exact<{
    sku: Types.Scalars["ID"];
}>;

export type GetProductStockQuery = {
    __typename?: "Query";
    getProduct: {
        __typename?: "IProduct";
        inventoryEntry: {
            __typename?: "InventoryEntry";
            stock: { __typename?: "Stock"; shelf: number };
        };
    };
};

export type GetTaskByIdQueryVariables = Types.Exact<{
    taskId: Types.Scalars["ID"];
}>;

export type GetTaskByIdQuery = {
    __typename?: "Query";
    getTaskById: {
        __typename?: "GetTaskByIdResponse";
        task?: {
            __typename?: "ICheck";
            id: string;
            priority: number;
            productSku: string;
            shelfNumber: string;
            type: Types.TaskType;
            status: Types.CheckStatus;
            product?: {
                __typename?: "IProduct";
                sku: string;
                name: string;
                imageUrl?: string | null;
                minDaysToBestBeforeDate?: number | null;
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            } | null;
        } | null;
    };
};

export type InventoryHubNextCheckQueryVariables = Types.Exact<{ [key: string]: never }>;

export type InventoryHubNextCheckQuery = {
    __typename?: "Query";
    getNextCheckForHub: {
        __typename?: "GetNextCheckForHubResponse";
        check?: {
            __typename?: "ICheck";
            id: string;
            priority: number;
            shelfNumber: string;
            type: Types.TaskType;
            status: Types.CheckStatus;
            product?: {
                __typename?: "IProduct";
                sku: string;
                name: string;
                imageUrl?: string | null;
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            } | null;
        } | null;
    };
};

export type InventoryPendingCheckCountQueryVariables = Types.Exact<{
    input?: Types.InputMaybe<Types.CheckFilters>;
}>;

export type InventoryPendingCheckCountQuery = {
    __typename?: "Query";
    getOpenedChecksCountForHub: {
        __typename?: "GetOpenedChecksCountForHubResponse";
        checkCount?: number | null;
    };
};

export type InventoryPendingChecksQueryVariables = Types.Exact<{
    input?: Types.InputMaybe<Types.CheckFilters>;
}>;

export type InventoryPendingChecksQuery = {
    __typename?: "Query";
    getPendingChecks: {
        __typename?: "GetPendingChecksResponse";
        checks: Array<{
            __typename?: "ICheck";
            id: string;
            priority: number;
            shelfNumber: string;
            type: Types.TaskType;
        }>;
    };
};

export type InventoryShelfNextCheckQueryVariables = Types.Exact<{
    shelfNumber: Types.Scalars["String"];
    filters?: Types.InputMaybe<Types.CheckFilters>;
}>;

export type InventoryShelfNextCheckQuery = {
    __typename?: "Query";
    getNextCheckForShelf: {
        __typename?: "GetNextCheckForShelfResponse";
        check?: {
            __typename?: "ICheck";
            id: string;
            priority: number;
            productSku: string;
            shelfNumber: string;
            type: Types.TaskType;
            status: Types.CheckStatus;
            product?: {
                __typename?: "IProduct";
                sku: string;
                name: string;
                imageUrl?: string | null;
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            } | null;
        } | null;
    };
};

export type ItemFragment = {
    __typename?: "Item";
    id: string;
    sku?: string | null;
    quantity?: number | null;
    product?: {
        __typename?: "IProduct";
        name: string;
        imageUrl?: string | null;
        sku: string;
        inventoryEntry: {
            __typename?: "InventoryEntry";
            shelfNumber?: string | null;
            stock: { __typename?: "Stock"; shelf: number };
        };
        countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
        units: Array<{ __typename?: "Unit"; ean?: string | null; type: string }>;
    } | null;
};

export type OrderFragment = {
    __typename?: "Order";
    id: string;
    number?: string | null;
    state?: string | null;
    createdAt?: string | null;
    isClickAndCollect: boolean;
    isNewCustomer: boolean;
    reseller: string;
    externalProviderId?: string | null;
    customerFirstName?: string | null;
    customerLastName?: string | null;
    isInStore: boolean;
    ageVerification: string;
    weight: number;
    pickingItemCount: number;
};

export type StartPickingMutationVariables = Types.Exact<{
    orderNumber: Types.Scalars["String"];
}>;

export type StartPickingMutation = {
    __typename?: "Mutation";
    startPickingV2: {
        __typename?: "StartPickingResponse";
        externalDeliveryProvider?: string | null;
        handoverIdentifier?: string | null;
        deliveryTag?: string | null;
        order?: {
            __typename?: "Order";
            id: string;
            number?: string | null;
            state?: string | null;
            createdAt?: string | null;
            isClickAndCollect: boolean;
            isNewCustomer: boolean;
            reseller: string;
            externalProviderId?: string | null;
            customerFirstName?: string | null;
            customerLastName?: string | null;
            isInStore: boolean;
            ageVerification: string;
            weight: number;
            pickingItemCount: number;
            items: Array<{
                __typename?: "Item";
                id: string;
                sku?: string | null;
                quantity?: number | null;
                product?: {
                    __typename?: "IProduct";
                    name: string;
                    imageUrl?: string | null;
                    sku: string;
                    inventoryEntry: {
                        __typename?: "InventoryEntry";
                        shelfNumber?: string | null;
                        stock: { __typename?: "Stock"; shelf: number };
                    };
                    countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
                    units: Array<{ __typename?: "Unit"; ean?: string | null; type: string }>;
                } | null;
            } | null>;
        } | null;
    };
};

export type StartManualPickingMutationVariables = Types.Exact<{
    orderNumber: Types.Scalars["String"];
}>;

export type StartManualPickingMutation = {
    __typename?: "Mutation";
    startManualPickingV2: {
        __typename?: "StartPickingResponse";
        externalDeliveryProvider?: string | null;
        handoverIdentifier?: string | null;
        deliveryTag?: string | null;
        order?: {
            __typename?: "Order";
            id: string;
            number?: string | null;
            state?: string | null;
            createdAt?: string | null;
            isClickAndCollect: boolean;
            isNewCustomer: boolean;
            reseller: string;
            externalProviderId?: string | null;
            customerFirstName?: string | null;
            customerLastName?: string | null;
            isInStore: boolean;
            ageVerification: string;
            weight: number;
            pickingItemCount: number;
            items: Array<{
                __typename?: "Item";
                id: string;
                sku?: string | null;
                quantity?: number | null;
                product?: {
                    __typename?: "IProduct";
                    name: string;
                    imageUrl?: string | null;
                    sku: string;
                    inventoryEntry: {
                        __typename?: "InventoryEntry";
                        shelfNumber?: string | null;
                        stock: { __typename?: "Stock"; shelf: number };
                    };
                    countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
                    units: Array<{ __typename?: "Unit"; ean?: string | null; type: string }>;
                } | null;
            } | null>;
        } | null;
    };
};

export type EndPickingMutationVariables = Types.Exact<{
    orderNumber: Types.Scalars["String"];
    missingItems: Array<Types.MissingItem> | Types.MissingItem;
    containersIds?: Types.InputMaybe<Array<Types.Scalars["String"]> | Types.Scalars["String"]>;
    shelvesIds?: Types.InputMaybe<Array<Types.Scalars["String"]> | Types.Scalars["String"]>;
}>;

export type EndPickingMutation = {
    __typename?: "Mutation";
    endPicking: { __typename?: "MutationResponse"; message: string };
};

export type NextOrderForPickingQueryVariables = Types.Exact<{ [key: string]: never }>;

export type NextOrderForPickingQuery = {
    __typename?: "Query";
    nextOrderForPicking: {
        __typename?: "NextOrderToBePreparedResponse";
        order?: {
            __typename?: "Order";
            id: string;
            number?: string | null;
            state?: string | null;
            createdAt?: string | null;
            isClickAndCollect: boolean;
            isNewCustomer: boolean;
            reseller: string;
            externalProviderId?: string | null;
            customerFirstName?: string | null;
            customerLastName?: string | null;
            isInStore: boolean;
            ageVerification: string;
            weight: number;
            pickingItemCount: number;
            items: Array<{
                __typename?: "Item";
                id: string;
                sku?: string | null;
                quantity?: number | null;
                product?: {
                    __typename?: "IProduct";
                    name: string;
                    imageUrl?: string | null;
                    sku: string;
                    inventoryEntry: {
                        __typename?: "InventoryEntry";
                        shelfNumber?: string | null;
                        stock: { __typename?: "Stock"; shelf: number };
                    };
                    countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
                    units: Array<{ __typename?: "Unit"; ean?: string | null; type: string }>;
                } | null;
            } | null>;
        } | null;
    };
};

export type NextOrderForPickingIdQueryVariables = Types.Exact<{ [key: string]: never }>;

export type NextOrderForPickingIdQuery = {
    __typename?: "Query";
    nextOrderForPicking: {
        __typename?: "NextOrderToBePreparedResponse";
        order?: { __typename?: "Order"; id: string; number?: string | null } | null;
    };
};

export type GetSummaryOfNextOrderToPickQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSummaryOfNextOrderToPickQuery = {
    __typename?: "Query";
    getSummaryOfNextOrderToPick: {
        __typename?: "SummaryOfNextOrderToPickResponse";
        orderSummary?: { __typename?: "OrderSummary"; id: string; number?: string | null } | null;
    };
};

export type GetOrderQueryVariables = Types.Exact<{
    input: Types.GetOrderInput;
}>;

export type GetOrderQuery = {
    __typename?: "Query";
    getOrder: {
        __typename?: "GetOrderResponse";
        order: {
            __typename?: "Order";
            id: string;
            number?: string | null;
            state?: string | null;
            createdAt?: string | null;
            isClickAndCollect: boolean;
            isNewCustomer: boolean;
            reseller: string;
            externalProviderId?: string | null;
            customerFirstName?: string | null;
            customerLastName?: string | null;
            isInStore: boolean;
            ageVerification: string;
            weight: number;
            pickingItemCount: number;
            items: Array<{
                __typename?: "Item";
                id: string;
                sku?: string | null;
                quantity?: number | null;
                product?: {
                    __typename?: "IProduct";
                    name: string;
                    imageUrl?: string | null;
                    sku: string;
                    inventoryEntry: {
                        __typename?: "InventoryEntry";
                        shelfNumber?: string | null;
                        stock: { __typename?: "Stock"; shelf: number };
                    };
                    countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
                    units: Array<{ __typename?: "Unit"; ean?: string | null; type: string }>;
                } | null;
            } | null>;
        };
    };
};

export type SearchUnitsByEanQueryVariables = Types.Exact<{
    searchUnitsByEanInput: Types.SearchUnitsByEanInput;
}>;

export type SearchUnitsByEanQuery = {
    __typename?: "Query";
    searchUnitsByEan: {
        __typename?: "SearchUnitsByEanResponse";
        units: Array<{
            __typename?: "Unit";
            id: string;
            ean?: string | null;
            productSku: string;
            quantity: number;
            type: string;
            product: {
                __typename?: "IProduct";
                imageUrl?: string | null;
                name: string;
                bio?: boolean | null;
                numberOfShelfFacings?: number | null;
                isShelvedInHandlingUnits?: boolean | null;
                inventoryEntry: {
                    __typename?: "InventoryEntry";
                    shelfNumber?: string | null;
                    stock: { __typename?: "Stock"; shelf: number };
                };
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            };
        }>;
    };
};

export type SearchInboundUnitsByTextQueryVariables = Types.Exact<{
    searchUnitsByTextInput: Types.SearchUnitsByTextInput;
}>;

export type SearchInboundUnitsByTextQuery = {
    __typename?: "Query";
    searchUnitsByText: {
        __typename?: "SearchUnitsByTextResponse";
        matchType?: Types.MatchType | null;
        units: Array<{
            __typename?: "Unit";
            id: string;
            ean?: string | null;
            productSku: string;
            quantity: number;
            type: string;
            product: {
                __typename?: "IProduct";
                imageUrl?: string | null;
                name: string;
                bio?: boolean | null;
                numberOfShelfFacings?: number | null;
                isShelvedInHandlingUnits?: boolean | null;
                inventoryEntry: { __typename?: "InventoryEntry"; shelfNumber?: string | null };
                countryOfOrigin: { __typename?: "CountryOfOrigin"; code?: string | null };
            };
        }>;
    };
};

export type GetUnitsSizesQueryVariables = Types.Exact<{
    input: Types.GetProductsInput;
}>;

export type GetUnitsSizesQuery = {
    __typename?: "Query";
    getProducts: {
        __typename?: "GetProductsResponse";
        products: Array<{
            __typename?: "IProduct";
            sku: string;
            units: Array<{ __typename?: "Unit"; quantity: number }>;
        }>;
    };
};
