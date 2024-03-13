export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CategoryV2 = {
  __typename?: "CategoryV2";
  id: Scalars["ID"];
  name: Scalars["String"];
  subcategories: Array<SubcategoryV2>;
};

export type CheckFilters = {
  priority?: InputMaybe<Array<Scalars["Int"]>>;
  type?: InputMaybe<Array<TaskType>>;
};

export type CheckMutationResponse = {
  __typename?: "CheckMutationResponse";
  success: Scalars["Boolean"];
};

export enum CheckStatus {
  canceled = "CANCELED",
  done = "DONE",
  in_progress = "IN_PROGRESS",
  open = "OPEN",
  skipped = "SKIPPED",
  unfulfillable = "UNFULFILLABLE",
}

export type CountryOfOrigin = {
  __typename?: "CountryOfOrigin";
  code?: Maybe<Scalars["String"]>;
};

export type CreateCheckInput = {
  metadataReason: TaskMetadataReason;
  priority: Scalars["Int"];
  shelfNumber: Scalars["String"];
  sku: Scalars["String"];
  type: TaskType;
};

export type CreatePrivateRestockingListInput = {
  skus: Array<Scalars["String"]>;
};

export type DeletePrivateListResponse = {
  __typename?: "DeletePrivateListResponse";
  message: Scalars["String"];
  success: Scalars["Boolean"];
};

export enum DeliveryCheckinProductCategory {
  drinks = "DRINKS",
  dry = "DRY",
  fresh = "FRESH",
  frozen = "FROZEN",
}

export type DeliveryCheckinResponse = {
  __typename?: "DeliveryCheckinResponse";
  deliveryCheckin: IDeliveryCheckin;
};

export type DespatchAdvice = {
  __typename?: "DespatchAdvice";
  id: Scalars["ID"];
  items: Array<DespatchAdviceItem>;
};

export type DespatchAdviceItem = {
  __typename?: "DespatchAdviceItem";
  handlingUnitSize: Scalars["Int"];
  isTotalQuantityEstimate: Scalars["Boolean"];
  skus: Array<Scalars["String"]>;
  totalQuantity: Scalars["Int"];
};

export type DeviceClaim = {
  __typename?: "DeviceClaim";
  deviceId?: Maybe<Scalars["String"]>;
  employeeId: Scalars["ID"];
  hubSlug: Scalars["String"];
};

export type DeviceClaimInput = {
  employeeId: Scalars["String"];
};

export type EndInboundingInput = {
  employeeId: Scalars["String"];
};

export type EndInboundingResponse = {
  __typename?: "EndInboundingResponse";
  timestamp: Scalars["DateTime"];
};

export type GetDeliveryCheckinsResponse = {
  __typename?: "GetDeliveryCheckinsResponse";
  deliveryCheckins: Array<IDeliveryCheckin>;
};

export type GetDespatchAdviceByRolliIdInput = {
  rolliID: Scalars["String"];
};

export type GetDespatchAdviceByRolliIdResponse = {
  __typename?: "GetDespatchAdviceByRolliIDResponse";
  despatchAdvice: DespatchAdvice;
};

export type GetInventoryEntriesByShelfInput = {
  shelfNumber: Scalars["String"];
};

export type GetInventoryEntriesByShelfResponse = {
  __typename?: "GetInventoryEntriesByShelfResponse";
  inventoryEntries: Array<InventoryEntry>;
};

export type GetNextCheckForHubResponse = {
  __typename?: "GetNextCheckForHubResponse";
  check?: Maybe<ICheck>;
  /** @deprecated Use GetOpenedChecksCountForHub instead */
  pendingChecksCount?: Maybe<Scalars["Int"]>;
};

export type GetNextCheckForShelfInput = {
  filters?: InputMaybe<CheckFilters>;
  shelfNumber: Scalars["String"];
};

export type GetNextCheckForShelfResponse = {
  __typename?: "GetNextCheckForShelfResponse";
  check?: Maybe<ICheck>;
};

export type GetNonScannableCategoriesV2Input = {
  categoryId: Scalars["String"];
};

export type GetOpenedChecksCountForHubResponse = {
  __typename?: "GetOpenedChecksCountForHubResponse";
  pendingChecksCount?: Maybe<Scalars["Int"]>;
};

export type GetOrderInput = {
  orderId: Scalars["String"];
};

export type GetOrderResponse = {
  __typename?: "GetOrderResponse";
  order: Order;
};

export type GetPendingChecksResponse = {
  __typename?: "GetPendingChecksResponse";
  checks: Array<ICheck>;
};

export type GetProductInput = {
  sku: Scalars["ID"];
};

export type GetProductsBySubcategoryInput = {
  subcategoryId: Scalars["String"];
};

export type GetProductsBySubcategoryResponse = {
  __typename?: "GetProductsBySubcategoryResponse";
  products: Array<IProduct>;
};

export type GetProductsInput = {
  skus: Array<Scalars["ID"]>;
};

export type GetProductsResponse = {
  __typename?: "GetProductsResponse";
  products: Array<IProduct>;
};

export type GetPublicRestockingListResponse = {
  __typename?: "GetPublicRestockingListResponse";
  publicRestockingList: PublicRestockingList;
};

export type GetSuppliersForHubResponse = {
  __typename?: "GetSuppliersForHubResponse";
  suppliers: Array<ISupplier>;
};

export type GetTaskByIdInput = {
  taskId: Scalars["ID"];
};

export type GetTaskByIdResponse = {
  __typename?: "GetTaskByIdResponse";
  task?: Maybe<ICheck>;
};

export type HubOneEmployee = {
  __typename?: "HubOneEmployee";
  badgeNo: Scalars["ID"];
  firstName: Scalars["String"];
  hubs: Array<Scalars["String"]>;
  isActive?: Maybe<Scalars["Boolean"]>;
  lastName: Scalars["String"];
  roles: Array<Scalars["String"]>;
};

export type ICheck = {
  __typename?: "ICheck";
  id: Scalars["ID"];
  priority: Scalars["Int"];
  product?: Maybe<IProduct>;
  productSku: Scalars["String"];
  shelfNumber: Scalars["String"];
  status: CheckStatus;
  type: TaskType;
};

export type IDeliveryCheckin = {
  __typename?: "IDeliveryCheckin";
  categories: Array<DeliveryCheckinProductCategory>;
  /** Timestamp in ISO 8601 format. Example: 2023-02-06T13:33:44+00:00 */
  created_at: Scalars["String"];
  /** Timestamp in ISO 8601 format. Example: 2023-02-06T13:33:44+00:00 */
  delivered_at: Scalars["String"];
  hub_slug: Scalars["String"];
  id: Scalars["ID"];
  supplier: ISupplierSummary;
};

export type IProduct = {
  __typename?: "IProduct";
  bbd?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["Boolean"]>;
  countryOfOrigin: CountryOfOrigin;
  imageUrl?: Maybe<Scalars["String"]>;
  inventoryEntry: InventoryEntry;
  isShelvedInHandlingUnits?: Maybe<Scalars["Boolean"]>;
  minDaysToBestBeforeDate?: Maybe<Scalars["Int"]>;
  name: Scalars["String"];
  numberOfShelfFacings?: Maybe<Scalars["Int"]>;
  sku: Scalars["ID"];
  units: Array<Unit>;
};

export type ISupplier = {
  __typename?: "ISupplier";
  id: Scalars["ID"];
  name: Scalars["String"];
  sortSequence: Scalars["Int"];
};

export type ISupplierSummary = {
  __typename?: "ISupplierSummary";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export enum InventoryChangeReason {
  correction = "CORRECTION",
  extra_check = "EXTRA_CHECK",
  inbound_bulk = "INBOUND_BULK",
  inbound_goods_received = "INBOUND_GOODS_RECEIVED",
  low_stock_check = "LOW_STOCK_CHECK",
  order_cancelled = "ORDER_CANCELLED",
  order_created = "ORDER_CREATED",
  outbound_delivery_product_damaged = "OUTBOUND_DELIVERY_PRODUCT_DAMAGED",
  outbound_delivery_product_expired = "OUTBOUND_DELIVERY_PRODUCT_EXPIRED",
  outbound_product_damaged = "OUTBOUND_PRODUCT_DAMAGED",
  outbound_product_expired = "OUTBOUND_PRODUCT_EXPIRED",
  outbound_too_good_to_go = "OUTBOUND_TOO_GOOD_TO_GO",
  out_of_stock_check = "OUT_OF_STOCK_CHECK",
  rolling_inventory_check = "ROLLING_INVENTORY_CHECK",
  unspecified = "UNSPECIFIED",
}

export type InventoryEntry = {
  __typename?: "InventoryEntry";
  hubSlug: Scalars["ID"];
  product?: Maybe<IProduct>;
  productSku: Scalars["ID"];
  shelfNumber?: Maybe<Scalars["String"]>;
  stock: Stock;
};

export type Item = {
  __typename?: "Item";
  id: Scalars["ID"];
  product?: Maybe<IProduct>;
  quantity?: Maybe<Scalars["Float"]>;
  sku?: Maybe<Scalars["String"]>;
};

export enum MatchType {
  ean = "ean",
  name = "name",
  sku = "sku",
}

export type MissingItem = {
  comment?: InputMaybe<Scalars["String"]>;
  quantity: Scalars["Float"];
  sku: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  claimDevice: DeviceClaim;
  createCheck: CheckMutationResponse;
  createDeliveryCheckinForHub: DeliveryCheckinResponse;
  createPrivateRestockingList: PrivateRestockingListResponse;
  deletePrivateRestockingList: DeletePrivateListResponse;
  endInbounding: EndInboundingResponse;
  endPicking: MutationResponse;
  forceClaimDevice: DeviceClaim;
  identifyEmployee: HubOneEmployee;
  removeItemFromRestockingPrivateList: RestockingMutationResponse;
  restockItem: RestockingMutationResponse;
  saveSkuToPublicRestockingList: SaveSkuToPublicRestockingListResponse;
  startCheck: CheckMutationResponse;
  startInbounding: StartInboundingResponse;
  startManualPickingV2: StartPickingResponse;
  startPickingV2: StartPickingResponse;
  unclaimDevice: MutationResponse;
  updateProductBBD: CheckMutationResponse;
  updateProductStockByDeltaAndMultipleReasons: UpdateProductStockByDeltaAndMultipleReasonsResponse;
  validateBBDCheck: CheckMutationResponse;
  validateEoyCheck: CheckMutationResponse;
  validateFreshnessCheck: CheckMutationResponse;
  validateStockCheck: CheckMutationResponse;
};

export type MutationClaimDeviceArgs = {
  input: DeviceClaimInput;
};

export type MutationCreateCheckArgs = {
  input: CreateCheckInput;
};

export type MutationCreateDeliveryCheckinForHubArgs = {
  input: NewDeliveryCheckinInput;
};

export type MutationCreatePrivateRestockingListArgs = {
  input: CreatePrivateRestockingListInput;
};

export type MutationDeletePrivateRestockingListArgs = {
  input: PrivateListIdInput;
};

export type MutationEndInboundingArgs = {
  input: EndInboundingInput;
};

export type MutationEndPickingArgs = {
  containersIds?: InputMaybe<Array<Scalars["String"]>>;
  missingItems: Array<MissingItem>;
  orderNumber: Scalars["String"];
  shelvesIds?: InputMaybe<Array<Scalars["String"]>>;
};

export type MutationForceClaimDeviceArgs = {
  input: DeviceClaimInput;
};

export type MutationIdentifyEmployeeArgs = {
  badgeNo: Scalars["String"];
};

export type MutationRemoveItemFromRestockingPrivateListArgs = {
  input: RestockItemWithSkuAndListIdInput;
};

export type MutationRestockItemArgs = {
  input: RestockItemWithSkuAndListIdInput;
};

export type MutationSaveSkuToPublicRestockingListArgs = {
  input: RestockingItemInput;
};

export type MutationStartCheckArgs = {
  input: StartCheckInput;
};

export type MutationStartInboundingArgs = {
  input: StartInboundingInput;
};

export type MutationStartManualPickingV2Args = {
  orderNumber: Scalars["String"];
};

export type MutationStartPickingV2Args = {
  orderNumber: Scalars["String"];
};

export type MutationUnclaimDeviceArgs = {
  input: DeviceClaimInput;
};

export type MutationUpdateProductBbdArgs = {
  input: UpdateProductBbdInput;
};

export type MutationUpdateProductStockByDeltaAndMultipleReasonsArgs = {
  UpdateProductStockByDeltaAndMultipleReasonsInput: UpdateProductStockByDeltaAndMultipleReasonsInput;
};

export type MutationValidateBbdCheckArgs = {
  input: ValidateBbdCheckInput;
};

export type MutationValidateEoyCheckArgs = {
  input: ValidateEoyCheckInput;
};

export type MutationValidateFreshnessCheckArgs = {
  input: ValidateFreshnessCheckInput;
};

export type MutationValidateStockCheckArgs = {
  input: ValidateStockCheckInput;
};

export type MutationResponse = {
  __typename?: "MutationResponse";
  message: Scalars["String"];
};

export type NewDeliveryCheckinInput = {
  categories: Array<Scalars["String"]>;
  delivered_at: Scalars["String"];
  supplier_id: Scalars["String"];
};

export type NextOrderToBePreparedResponse = {
  __typename?: "NextOrderToBePreparedResponse";
  order?: Maybe<Order>;
};

export type NonScannableCategoriesV2Response = {
  __typename?: "NonScannableCategoriesV2Response";
  categories: Array<CategoryV2>;
};

export type NonScannableSubcategoriesV2Response = {
  __typename?: "NonScannableSubcategoriesV2Response";
  subcategories: Array<SubcategoryV2>;
};

export type Order = {
  __typename?: "Order";
  ageVerification: Scalars["String"];
  createdAt?: Maybe<Scalars["String"]>;
  customerFirstName?: Maybe<Scalars["String"]>;
  customerLastName?: Maybe<Scalars["String"]>;
  externalProviderId?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  isClickAndCollect: Scalars["Boolean"];
  isInStore: Scalars["Boolean"];
  isNewCustomer: Scalars["Boolean"];
  items: Array<Maybe<Item>>;
  number?: Maybe<Scalars["String"]>;
  pickingItemCount: Scalars["Int"];
  reseller: Scalars["String"];
  state?: Maybe<Scalars["String"]>;
  weight: Scalars["Int"];
};

export type OrderSummary = {
  __typename?: "OrderSummary";
  customerEmail?: Maybe<Scalars["String"]>;
  customerFirstName?: Maybe<Scalars["String"]>;
  customerLastName?: Maybe<Scalars["String"]>;
  externalProvider?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  isNewCustomer?: Maybe<Scalars["Boolean"]>;
  number?: Maybe<Scalars["String"]>;
};

export type PrivateListIdInput = {
  privateListId: Scalars["String"];
};

export type PrivateRestockingListResponse = {
  __typename?: "PrivateRestockingListResponse";
  hubSlug: Scalars["String"];
  id: Scalars["ID"];
  opsAssociateId: Scalars["String"];
  restockingItems: Array<RestockingItem>;
};

export type ProductStockUpdateParams = {
  desadv?: InputMaybe<Scalars["String"]>;
  expectedQuantity?: InputMaybe<Scalars["String"]>;
  inboundingMethod?: InputMaybe<Scalars["String"]>;
  inboundingUnit?: InputMaybe<Scalars["String"]>;
  quantityDelta: Scalars["Int"];
  reason: InventoryChangeReason;
  scannedEAN?: InputMaybe<Scalars["String"]>;
  sscc?: InputMaybe<Scalars["String"]>;
  transactionId: Scalars["String"];
};

export type PublicRestockingList = {
  __typename?: "PublicRestockingList";
  hubSlug: Scalars["String"];
  restockingItems: Array<RestockingItem>;
};

export type Query = {
  __typename?: "Query";
  getDeliveryCheckInsForHubDeliveredToday: GetDeliveryCheckinsResponse;
  getDespatchAdviceByRolliID: GetDespatchAdviceByRolliIdResponse;
  getInventoryEntriesByShelf: GetInventoryEntriesByShelfResponse;
  getNextCheckForHub: GetNextCheckForHubResponse;
  getNextCheckForShelf: GetNextCheckForShelfResponse;
  getNonScannableCategories: NonScannableCategoriesV2Response;
  getNonScannableSubcategoriesForCategory: NonScannableSubcategoriesV2Response;
  getOpenedChecksCountForHub: GetOpenedChecksCountForHubResponse;
  getOrder: GetOrderResponse;
  getPendingChecks: GetPendingChecksResponse;
  getPrivateRestockingList: PrivateRestockingListResponse;
  getProduct: IProduct;
  getProducts: GetProductsResponse;
  getProductsBySubcategoryV2: GetProductsBySubcategoryResponse;
  getPublicRestockingList: GetPublicRestockingListResponse;
  getSummaryOfNextOrderToPick: SummaryOfNextOrderToPickResponse;
  getSuppliersForHub: GetSuppliersForHubResponse;
  getTaskById: GetTaskByIdResponse;
  nextOrderForPicking: NextOrderToBePreparedResponse;
  searchUnitsByEan: SearchUnitsByEanResponse;
  searchUnitsByText: SearchUnitsByTextResponse;
};

export type QueryGetDespatchAdviceByRolliIdArgs = {
  GetDespatchAdviceByRolliIDInput: GetDespatchAdviceByRolliIdInput;
};

export type QueryGetInventoryEntriesByShelfArgs = {
  input: GetInventoryEntriesByShelfInput;
};

export type QueryGetNextCheckForShelfArgs = {
  input: GetNextCheckForShelfInput;
};

export type QueryGetNonScannableSubcategoriesForCategoryArgs = {
  input: GetNonScannableCategoriesV2Input;
};

export type QueryGetOpenedChecksCountForHubArgs = {
  input?: InputMaybe<CheckFilters>;
};

export type QueryGetOrderArgs = {
  input: GetOrderInput;
};

export type QueryGetPendingChecksArgs = {
  input?: InputMaybe<CheckFilters>;
};

export type QueryGetProductArgs = {
  input: GetProductInput;
};

export type QueryGetProductsArgs = {
  input: GetProductsInput;
};

export type QueryGetProductsBySubcategoryV2Args = {
  input: GetProductsBySubcategoryInput;
};

export type QueryGetTaskByIdArgs = {
  input: GetTaskByIdInput;
};

export type QuerySearchUnitsByEanArgs = {
  searchUnitsByEanInput: SearchUnitsByEanInput;
};

export type QuerySearchUnitsByTextArgs = {
  searchUnitsByTextInput: SearchUnitsByTextInput;
};

export type RestockItemWithSkuAndListIdInput = {
  listId: Scalars["String"];
  sku: Scalars["String"];
};

export type RestockingItem = {
  __typename?: "RestockingItem";
  hubSlug: Scalars["String"];
  privateListId?: Maybe<Scalars["String"]>;
  product?: Maybe<IProduct>;
  sku: Scalars["String"];
  status: RestockingItemStatus;
};

export type RestockingItemInput = {
  sku: Scalars["String"];
};

export enum RestockingItemStatus {
  done = "DONE",
  new = "NEW",
}

export type RestockingMutationResponse = {
  __typename?: "RestockingMutationResponse";
  message: Scalars["String"];
};

export type SaveSkuToPublicRestockingListResponse = {
  __typename?: "SaveSkuToPublicRestockingListResponse";
  success: Scalars["Boolean"];
};

export type SearchUnitsByEanInput = {
  ean: Scalars["String"];
};

export type SearchUnitsByEanResponse = {
  __typename?: "SearchUnitsByEanResponse";
  units: Array<Unit>;
};

export type SearchUnitsByTextInput = {
  query: Scalars["String"];
};

export type SearchUnitsByTextResponse = {
  __typename?: "SearchUnitsByTextResponse";
  matchType?: Maybe<MatchType>;
  units: Array<Unit>;
};

export type StartCheckInput = {
  checkId: Scalars["ID"];
};

export type StartInboundingInput = {
  employeeId: Scalars["String"];
};

export type StartInboundingResponse = {
  __typename?: "StartInboundingResponse";
  timestamp: Scalars["DateTime"];
};

export type StartPickingResponse = {
  __typename?: "StartPickingResponse";
  deliveryTag?: Maybe<Scalars["String"]>;
  externalDeliveryProvider?: Maybe<Scalars["String"]>;
  handoverIdentifier?: Maybe<Scalars["String"]>;
  order?: Maybe<Order>;
};

export type Stock = {
  __typename?: "Stock";
  /** The stock available for clients */
  available: Scalars["Int"];
  /** The number of item already ordered but still on the shelf */
  reserved: Scalars["Int"];
  /** The real stock in the hub */
  shelf: Scalars["Int"];
};

export type SubcategoryV2 = {
  __typename?: "SubcategoryV2";
  id: Scalars["ID"];
  imageUrl?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  productsCount: Scalars["Int"];
};

export type SummaryOfNextOrderToPickResponse = {
  __typename?: "SummaryOfNextOrderToPickResponse";
  orderSummary?: Maybe<OrderSummary>;
};

export enum TaskMetadataReason {
  bbd = "BBD",
  bbd_missing = "BBD_MISSING",
  eoy_inventory = "EOY_INVENTORY",
  eoy_inventory_recount = "EOY_INVENTORY_RECOUNT",
  expensive = "EXPENSIVE",
  extra = "EXTRA",
  freshness = "FRESHNESS",
  low_stock = "LOW_STOCK",
  missing = "MISSING",
  rolling_8_weeks = "ROLLING_8_WEEKS",
  rolling_12_weeks = "ROLLING_12_WEEKS",
  spontaneous_correction = "SPONTANEOUS_CORRECTION",
  tobacco = "TOBACCO",
}

export enum TaskType {
  bbd_check = "BBD_CHECK",
  eoy_inventory_check = "EOY_INVENTORY_CHECK",
  eoy_inventory_recount_check = "EOY_INVENTORY_RECOUNT_CHECK",
  freshness_check = "FRESHNESS_CHECK",
  stock_check = "STOCK_CHECK",
}

export type Unit = {
  __typename?: "Unit";
  ean?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  product: IProduct;
  productSku: Scalars["ID"];
  quantity: Scalars["Int"];
  type: Scalars["String"];
};

export type UpdateProductBbdInput = {
  closestBBDAfterOutbound: Scalars["String"];
  sku: Scalars["String"];
};

export type UpdateProductStockByDeltaAndMultipleReasonsInput = {
  sku: Scalars["String"];
  stockUpdates: Array<ProductStockUpdateParams>;
};

export type UpdateProductStockByDeltaAndMultipleReasonsResponse = {
  __typename?: "UpdateProductStockByDeltaAndMultipleReasonsResponse";
  updateResults: Array<UpdateProductStockByDeltaResponse>;
};

export type UpdateProductStockByDeltaResponse = {
  __typename?: "UpdateProductStockByDeltaResponse";
  success: Scalars["Boolean"];
  transactionId: Scalars["String"];
};

export type ValidateBbdCheckInput = {
  checkId: Scalars["ID"];
  closestBBDAfterOutbound?: InputMaybe<Scalars["String"]>;
  quantityExpired?: InputMaybe<Scalars["Int"]>;
  quantityTooGoodToGo?: InputMaybe<Scalars["Int"]>;
};

export type ValidateEoyCheckInput = {
  checkId: Scalars["ID"];
  name: Scalars["String"];
  quantity: Scalars["Int"];
  type: TaskType;
};

export type ValidateFreshnessCheckInput = {
  checkId: Scalars["ID"];
  quantityDamaged?: InputMaybe<Scalars["Int"]>;
  quantityExpired?: InputMaybe<Scalars["Int"]>;
  quantityTooGoodToGo?: InputMaybe<Scalars["Int"]>;
};

export type ValidateStockCheckInput = {
  checkId: Scalars["ID"];
  /** This is the final counted stock, after removing damaged and perished */
  quantity: Scalars["Int"];
  quantityDamaged?: InputMaybe<Scalars["Int"]>;
  quantityExpired?: InputMaybe<Scalars["Int"]>;
  quantityTooGoodToGo?: InputMaybe<Scalars["Int"]>;
};
