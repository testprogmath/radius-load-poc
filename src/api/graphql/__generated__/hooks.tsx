import * as Types from "./operations";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export const ItemFragmentFragmentDoc = gql`
  fragment itemFragment on Item {
    id
    sku
    quantity
    product {
      name
      inventoryEntry {
        shelfNumber
        stock {
          shelf
        }
      }
      countryOfOrigin {
        code
      }
      imageUrl
      sku
      units {
        ean
        type
      }
    }
  }
`;
export const OrderFragmentFragmentDoc = gql`
  fragment orderFragment on Order {
    id
    number
    state
    createdAt
    isClickAndCollect
    isNewCustomer
    reseller
    externalProviderId
    customerFirstName
    customerLastName
    isInStore
    ageVerification
    weight
    pickingItemCount
  }
`;
export const CreateDeliveryCheckinForHubDocument = gql`
  mutation createDeliveryCheckinForHub($input: NewDeliveryCheckinInput!) {
    createDeliveryCheckinForHub(input: $input) {
      deliveryCheckin {
        id
      }
    }
  }
`;
export type CreateDeliveryCheckinForHubMutationFn = Apollo.MutationFunction<
  Types.CreateDeliveryCheckinForHubMutation,
  Types.CreateDeliveryCheckinForHubMutationVariables
>;

/**
 * __useCreateDeliveryCheckinForHubMutation__
 *
 * To run a mutation, you first call `useCreateDeliveryCheckinForHubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDeliveryCheckinForHubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDeliveryCheckinForHubMutation, { data, loading, error }] = useCreateDeliveryCheckinForHubMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDeliveryCheckinForHubMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.CreateDeliveryCheckinForHubMutation,
    Types.CreateDeliveryCheckinForHubMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.CreateDeliveryCheckinForHubMutation,
    Types.CreateDeliveryCheckinForHubMutationVariables
  >(CreateDeliveryCheckinForHubDocument, options);
}
export type CreateDeliveryCheckinForHubMutationHookResult = ReturnType<
  typeof useCreateDeliveryCheckinForHubMutation
>;
export type CreateDeliveryCheckinForHubMutationResult =
  Apollo.MutationResult<Types.CreateDeliveryCheckinForHubMutation>;
export type CreateDeliveryCheckinForHubMutationOptions = Apollo.BaseMutationOptions<
  Types.CreateDeliveryCheckinForHubMutation,
  Types.CreateDeliveryCheckinForHubMutationVariables
>;
export const GetDeliveryCheckInsForHubDeliveredTodayDocument = gql`
  query getDeliveryCheckInsForHubDeliveredToday {
    getDeliveryCheckInsForHubDeliveredToday {
      deliveryCheckins {
        categories
        delivered_at
        id
        supplier {
          id
          name
        }
      }
    }
  }
`;

/**
 * __useGetDeliveryCheckInsForHubDeliveredTodayQuery__
 *
 * To run a query within a React component, call `useGetDeliveryCheckInsForHubDeliveredTodayQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeliveryCheckInsForHubDeliveredTodayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeliveryCheckInsForHubDeliveredTodayQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDeliveryCheckInsForHubDeliveredTodayQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.GetDeliveryCheckInsForHubDeliveredTodayQuery,
    Types.GetDeliveryCheckInsForHubDeliveredTodayQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetDeliveryCheckInsForHubDeliveredTodayQuery,
    Types.GetDeliveryCheckInsForHubDeliveredTodayQueryVariables
  >(GetDeliveryCheckInsForHubDeliveredTodayDocument, options);
}
export function useGetDeliveryCheckInsForHubDeliveredTodayLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetDeliveryCheckInsForHubDeliveredTodayQuery,
    Types.GetDeliveryCheckInsForHubDeliveredTodayQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetDeliveryCheckInsForHubDeliveredTodayQuery,
    Types.GetDeliveryCheckInsForHubDeliveredTodayQueryVariables
  >(GetDeliveryCheckInsForHubDeliveredTodayDocument, options);
}
export type GetDeliveryCheckInsForHubDeliveredTodayQueryHookResult = ReturnType<
  typeof useGetDeliveryCheckInsForHubDeliveredTodayQuery
>;
export type GetDeliveryCheckInsForHubDeliveredTodayLazyQueryHookResult = ReturnType<
  typeof useGetDeliveryCheckInsForHubDeliveredTodayLazyQuery
>;
export type GetDeliveryCheckInsForHubDeliveredTodayQueryResult = Apollo.QueryResult<
  Types.GetDeliveryCheckInsForHubDeliveredTodayQuery,
  Types.GetDeliveryCheckInsForHubDeliveredTodayQueryVariables
>;
export const GetSuppliersForHubDocument = gql`
  query getSuppliersForHub {
    getSuppliersForHub {
      suppliers {
        id
        name
        sortSequence
      }
    }
  }
`;

/**
 * __useGetSuppliersForHubQuery__
 *
 * To run a query within a React component, call `useGetSuppliersForHubQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSuppliersForHubQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSuppliersForHubQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSuppliersForHubQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.GetSuppliersForHubQuery,
    Types.GetSuppliersForHubQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.GetSuppliersForHubQuery, Types.GetSuppliersForHubQueryVariables>(
    GetSuppliersForHubDocument,
    options,
  );
}
export function useGetSuppliersForHubLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetSuppliersForHubQuery,
    Types.GetSuppliersForHubQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.GetSuppliersForHubQuery, Types.GetSuppliersForHubQueryVariables>(
    GetSuppliersForHubDocument,
    options,
  );
}
export type GetSuppliersForHubQueryHookResult = ReturnType<typeof useGetSuppliersForHubQuery>;
export type GetSuppliersForHubLazyQueryHookResult = ReturnType<
  typeof useGetSuppliersForHubLazyQuery
>;
export type GetSuppliersForHubQueryResult = Apollo.QueryResult<
  Types.GetSuppliersForHubQuery,
  Types.GetSuppliersForHubQueryVariables
>;
export const ClaimDeviceDocument = gql`
  mutation claimDevice($input: DeviceClaimInput!) {
    claimDevice(input: $input) {
      employeeId
    }
  }
`;
export type ClaimDeviceMutationFn = Apollo.MutationFunction<
  Types.ClaimDeviceMutation,
  Types.ClaimDeviceMutationVariables
>;

/**
 * __useClaimDeviceMutation__
 *
 * To run a mutation, you first call `useClaimDeviceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimDeviceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimDeviceMutation, { data, loading, error }] = useClaimDeviceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useClaimDeviceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.ClaimDeviceMutation,
    Types.ClaimDeviceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.ClaimDeviceMutation, Types.ClaimDeviceMutationVariables>(
    ClaimDeviceDocument,
    options,
  );
}
export type ClaimDeviceMutationHookResult = ReturnType<typeof useClaimDeviceMutation>;
export type ClaimDeviceMutationResult = Apollo.MutationResult<Types.ClaimDeviceMutation>;
export type ClaimDeviceMutationOptions = Apollo.BaseMutationOptions<
  Types.ClaimDeviceMutation,
  Types.ClaimDeviceMutationVariables
>;
export const ForceClaimDeviceDocument = gql`
  mutation forceClaimDevice($input: DeviceClaimInput!) {
    forceClaimDevice(input: $input) {
      employeeId
    }
  }
`;
export type ForceClaimDeviceMutationFn = Apollo.MutationFunction<
  Types.ForceClaimDeviceMutation,
  Types.ForceClaimDeviceMutationVariables
>;

/**
 * __useForceClaimDeviceMutation__
 *
 * To run a mutation, you first call `useForceClaimDeviceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForceClaimDeviceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forceClaimDeviceMutation, { data, loading, error }] = useForceClaimDeviceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useForceClaimDeviceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.ForceClaimDeviceMutation,
    Types.ForceClaimDeviceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.ForceClaimDeviceMutation,
    Types.ForceClaimDeviceMutationVariables
  >(ForceClaimDeviceDocument, options);
}
export type ForceClaimDeviceMutationHookResult = ReturnType<typeof useForceClaimDeviceMutation>;
export type ForceClaimDeviceMutationResult = Apollo.MutationResult<Types.ForceClaimDeviceMutation>;
export type ForceClaimDeviceMutationOptions = Apollo.BaseMutationOptions<
  Types.ForceClaimDeviceMutation,
  Types.ForceClaimDeviceMutationVariables
>;
export const UnclaimDeviceDocument = gql`
  mutation unclaimDevice($input: DeviceClaimInput!) {
    unclaimDevice(input: $input) {
      message
    }
  }
`;
export type UnclaimDeviceMutationFn = Apollo.MutationFunction<
  Types.UnclaimDeviceMutation,
  Types.UnclaimDeviceMutationVariables
>;

/**
 * __useUnclaimDeviceMutation__
 *
 * To run a mutation, you first call `useUnclaimDeviceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnclaimDeviceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unclaimDeviceMutation, { data, loading, error }] = useUnclaimDeviceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnclaimDeviceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.UnclaimDeviceMutation,
    Types.UnclaimDeviceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.UnclaimDeviceMutation, Types.UnclaimDeviceMutationVariables>(
    UnclaimDeviceDocument,
    options,
  );
}
export type UnclaimDeviceMutationHookResult = ReturnType<typeof useUnclaimDeviceMutation>;
export type UnclaimDeviceMutationResult = Apollo.MutationResult<Types.UnclaimDeviceMutation>;
export type UnclaimDeviceMutationOptions = Apollo.BaseMutationOptions<
  Types.UnclaimDeviceMutation,
  Types.UnclaimDeviceMutationVariables
>;
export const IdentifyEmployeeDocument = gql`
  mutation identifyEmployee($badgeNo: String!) {
    identifyEmployee(badgeNo: $badgeNo) {
      firstName
      lastName
      badgeNo
      isActive
      roles
    }
  }
`;
export type IdentifyEmployeeMutationFn = Apollo.MutationFunction<
  Types.IdentifyEmployeeMutation,
  Types.IdentifyEmployeeMutationVariables
>;

/**
 * __useIdentifyEmployeeMutation__
 *
 * To run a mutation, you first call `useIdentifyEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIdentifyEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [identifyEmployeeMutation, { data, loading, error }] = useIdentifyEmployeeMutation({
 *   variables: {
 *      badgeNo: // value for 'badgeNo'
 *   },
 * });
 */
export function useIdentifyEmployeeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.IdentifyEmployeeMutation,
    Types.IdentifyEmployeeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.IdentifyEmployeeMutation,
    Types.IdentifyEmployeeMutationVariables
  >(IdentifyEmployeeDocument, options);
}
export type IdentifyEmployeeMutationHookResult = ReturnType<typeof useIdentifyEmployeeMutation>;
export type IdentifyEmployeeMutationResult = Apollo.MutationResult<Types.IdentifyEmployeeMutation>;
export type IdentifyEmployeeMutationOptions = Apollo.BaseMutationOptions<
  Types.IdentifyEmployeeMutation,
  Types.IdentifyEmployeeMutationVariables
>;
export const StartInboundingDocument = gql`
  mutation startInbounding($input: StartInboundingInput!) {
    startInbounding(input: $input) {
      timestamp
    }
  }
`;
export type StartInboundingMutationFn = Apollo.MutationFunction<
  Types.StartInboundingMutation,
  Types.StartInboundingMutationVariables
>;

/**
 * __useStartInboundingMutation__
 *
 * To run a mutation, you first call `useStartInboundingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartInboundingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startInboundingMutation, { data, loading, error }] = useStartInboundingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartInboundingMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.StartInboundingMutation,
    Types.StartInboundingMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.StartInboundingMutation, Types.StartInboundingMutationVariables>(
    StartInboundingDocument,
    options,
  );
}
export type StartInboundingMutationHookResult = ReturnType<typeof useStartInboundingMutation>;
export type StartInboundingMutationResult = Apollo.MutationResult<Types.StartInboundingMutation>;
export type StartInboundingMutationOptions = Apollo.BaseMutationOptions<
  Types.StartInboundingMutation,
  Types.StartInboundingMutationVariables
>;
export const EndInboundingDocument = gql`
  mutation endInbounding($input: EndInboundingInput!) {
    endInbounding(input: $input) {
      timestamp
    }
  }
`;
export type EndInboundingMutationFn = Apollo.MutationFunction<
  Types.EndInboundingMutation,
  Types.EndInboundingMutationVariables
>;

/**
 * __useEndInboundingMutation__
 *
 * To run a mutation, you first call `useEndInboundingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEndInboundingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [endInboundingMutation, { data, loading, error }] = useEndInboundingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEndInboundingMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.EndInboundingMutation,
    Types.EndInboundingMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.EndInboundingMutation, Types.EndInboundingMutationVariables>(
    EndInboundingDocument,
    options,
  );
}
export type EndInboundingMutationHookResult = ReturnType<typeof useEndInboundingMutation>;
export type EndInboundingMutationResult = Apollo.MutationResult<Types.EndInboundingMutation>;
export type EndInboundingMutationOptions = Apollo.BaseMutationOptions<
  Types.EndInboundingMutation,
  Types.EndInboundingMutationVariables
>;
export const GetNonScannableCategoriesDocument = gql`
  query getNonScannableCategories {
    getNonScannableCategories {
      categories {
        id
        name
        subcategories {
          id
          name
          imageUrl
          productsCount
        }
      }
    }
  }
`;

/**
 * __useGetNonScannableCategoriesQuery__
 *
 * To run a query within a React component, call `useGetNonScannableCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNonScannableCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNonScannableCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNonScannableCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.GetNonScannableCategoriesQuery,
    Types.GetNonScannableCategoriesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetNonScannableCategoriesQuery,
    Types.GetNonScannableCategoriesQueryVariables
  >(GetNonScannableCategoriesDocument, options);
}
export function useGetNonScannableCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetNonScannableCategoriesQuery,
    Types.GetNonScannableCategoriesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetNonScannableCategoriesQuery,
    Types.GetNonScannableCategoriesQueryVariables
  >(GetNonScannableCategoriesDocument, options);
}
export type GetNonScannableCategoriesQueryHookResult = ReturnType<
  typeof useGetNonScannableCategoriesQuery
>;
export type GetNonScannableCategoriesLazyQueryHookResult = ReturnType<
  typeof useGetNonScannableCategoriesLazyQuery
>;
export type GetNonScannableCategoriesQueryResult = Apollo.QueryResult<
  Types.GetNonScannableCategoriesQuery,
  Types.GetNonScannableCategoriesQueryVariables
>;
export const GetDespatchAdviceByRolliIdDocument = gql`
  query getDespatchAdviceByRolliID($input: GetDespatchAdviceByRolliIDInput!) {
    getDespatchAdviceByRolliID(GetDespatchAdviceByRolliIDInput: $input) {
      despatchAdvice {
        id
        items {
          handlingUnitSize
          isTotalQuantityEstimate
          skus
          totalQuantity
        }
      }
    }
  }
`;

/**
 * __useGetDespatchAdviceByRolliIdQuery__
 *
 * To run a query within a React component, call `useGetDespatchAdviceByRolliIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDespatchAdviceByRolliIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDespatchAdviceByRolliIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetDespatchAdviceByRolliIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.GetDespatchAdviceByRolliIdQuery,
    Types.GetDespatchAdviceByRolliIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetDespatchAdviceByRolliIdQuery,
    Types.GetDespatchAdviceByRolliIdQueryVariables
  >(GetDespatchAdviceByRolliIdDocument, options);
}
export function useGetDespatchAdviceByRolliIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetDespatchAdviceByRolliIdQuery,
    Types.GetDespatchAdviceByRolliIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetDespatchAdviceByRolliIdQuery,
    Types.GetDespatchAdviceByRolliIdQueryVariables
  >(GetDespatchAdviceByRolliIdDocument, options);
}
export type GetDespatchAdviceByRolliIdQueryHookResult = ReturnType<
  typeof useGetDespatchAdviceByRolliIdQuery
>;
export type GetDespatchAdviceByRolliIdLazyQueryHookResult = ReturnType<
  typeof useGetDespatchAdviceByRolliIdLazyQuery
>;
export type GetDespatchAdviceByRolliIdQueryResult = Apollo.QueryResult<
  Types.GetDespatchAdviceByRolliIdQuery,
  Types.GetDespatchAdviceByRolliIdQueryVariables
>;
export const GetProductsStockDocument = gql`
  query getProductsStock($input: GetProductsInput!) {
    getProducts(input: $input) {
      products {
        sku
        inventoryEntry {
          stock {
            shelf
          }
        }
      }
    }
  }
`;

/**
 * __useGetProductsStockQuery__
 *
 * To run a query within a React component, call `useGetProductsStockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsStockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsStockQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetProductsStockQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.GetProductsStockQuery,
    Types.GetProductsStockQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.GetProductsStockQuery, Types.GetProductsStockQueryVariables>(
    GetProductsStockDocument,
    options,
  );
}
export function useGetProductsStockLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetProductsStockQuery,
    Types.GetProductsStockQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.GetProductsStockQuery, Types.GetProductsStockQueryVariables>(
    GetProductsStockDocument,
    options,
  );
}
export type GetProductsStockQueryHookResult = ReturnType<typeof useGetProductsStockQuery>;
export type GetProductsStockLazyQueryHookResult = ReturnType<typeof useGetProductsStockLazyQuery>;
export type GetProductsStockQueryResult = Apollo.QueryResult<
  Types.GetProductsStockQuery,
  Types.GetProductsStockQueryVariables
>;
export const GetProductsBySubcategoryV2Document = gql`
  query getProductsBySubcategoryV2($input: GetProductsBySubcategoryInput!) {
    getProductsBySubcategoryV2(input: $input) {
      products {
        bio
        imageUrl
        name
        sku
        numberOfShelfFacings
        isShelvedInHandlingUnits
        countryOfOrigin {
          code
        }
        inventoryEntry {
          shelfNumber
        }
        units {
          ean
          id
          quantity
          type
        }
      }
    }
  }
`;

/**
 * __useGetProductsBySubcategoryV2Query__
 *
 * To run a query within a React component, call `useGetProductsBySubcategoryV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsBySubcategoryV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsBySubcategoryV2Query({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetProductsBySubcategoryV2Query(
  baseOptions: Apollo.QueryHookOptions<
    Types.GetProductsBySubcategoryV2Query,
    Types.GetProductsBySubcategoryV2QueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetProductsBySubcategoryV2Query,
    Types.GetProductsBySubcategoryV2QueryVariables
  >(GetProductsBySubcategoryV2Document, options);
}
export function useGetProductsBySubcategoryV2LazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetProductsBySubcategoryV2Query,
    Types.GetProductsBySubcategoryV2QueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetProductsBySubcategoryV2Query,
    Types.GetProductsBySubcategoryV2QueryVariables
  >(GetProductsBySubcategoryV2Document, options);
}
export type GetProductsBySubcategoryV2QueryHookResult = ReturnType<
  typeof useGetProductsBySubcategoryV2Query
>;
export type GetProductsBySubcategoryV2LazyQueryHookResult = ReturnType<
  typeof useGetProductsBySubcategoryV2LazyQuery
>;
export type GetProductsBySubcategoryV2QueryResult = Apollo.QueryResult<
  Types.GetProductsBySubcategoryV2Query,
  Types.GetProductsBySubcategoryV2QueryVariables
>;
export const ValidateBbdCheckDocument = gql`
  mutation ValidateBBDCheck($input: ValidateBBDCheckInput!) {
    validateBBDCheck(input: $input) {
      success
    }
  }
`;
export type ValidateBbdCheckMutationFn = Apollo.MutationFunction<
  Types.ValidateBbdCheckMutation,
  Types.ValidateBbdCheckMutationVariables
>;

/**
 * __useValidateBbdCheckMutation__
 *
 * To run a mutation, you first call `useValidateBbdCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateBbdCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateBbdCheckMutation, { data, loading, error }] = useValidateBbdCheckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useValidateBbdCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.ValidateBbdCheckMutation,
    Types.ValidateBbdCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.ValidateBbdCheckMutation,
    Types.ValidateBbdCheckMutationVariables
  >(ValidateBbdCheckDocument, options);
}
export type ValidateBbdCheckMutationHookResult = ReturnType<typeof useValidateBbdCheckMutation>;
export type ValidateBbdCheckMutationResult = Apollo.MutationResult<Types.ValidateBbdCheckMutation>;
export type ValidateBbdCheckMutationOptions = Apollo.BaseMutationOptions<
  Types.ValidateBbdCheckMutation,
  Types.ValidateBbdCheckMutationVariables
>;
export const UpdateProductBbdDocument = gql`
  mutation updateProductBBD($input: UpdateProductBBDInput!) {
    updateProductBBD(input: $input) {
      success
    }
  }
`;
export type UpdateProductBbdMutationFn = Apollo.MutationFunction<
  Types.UpdateProductBbdMutation,
  Types.UpdateProductBbdMutationVariables
>;

/**
 * __useUpdateProductBbdMutation__
 *
 * To run a mutation, you first call `useUpdateProductBbdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductBbdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductBbdMutation, { data, loading, error }] = useUpdateProductBbdMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductBbdMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.UpdateProductBbdMutation,
    Types.UpdateProductBbdMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.UpdateProductBbdMutation,
    Types.UpdateProductBbdMutationVariables
  >(UpdateProductBbdDocument, options);
}
export type UpdateProductBbdMutationHookResult = ReturnType<typeof useUpdateProductBbdMutation>;
export type UpdateProductBbdMutationResult = Apollo.MutationResult<Types.UpdateProductBbdMutation>;
export type UpdateProductBbdMutationOptions = Apollo.BaseMutationOptions<
  Types.UpdateProductBbdMutation,
  Types.UpdateProductBbdMutationVariables
>;
export const GetProductWithBbdTaskDocument = gql`
  query getProductWithBBDTask($sku: ID!) {
    getProduct(input: { sku: $sku }) {
      name
      minDaysToBestBeforeDate
      sku
      imageUrl
      inventoryEntry {
        shelfNumber
        stock {
          shelf
        }
      }
      countryOfOrigin {
        code
      }
      bbd
      bio
    }
  }
`;

/**
 * __useGetProductWithBbdTaskQuery__
 *
 * To run a query within a React component, call `useGetProductWithBbdTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductWithBbdTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductWithBbdTaskQuery({
 *   variables: {
 *      sku: // value for 'sku'
 *   },
 * });
 */
export function useGetProductWithBbdTaskQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.GetProductWithBbdTaskQuery,
    Types.GetProductWithBbdTaskQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetProductWithBbdTaskQuery,
    Types.GetProductWithBbdTaskQueryVariables
  >(GetProductWithBbdTaskDocument, options);
}
export function useGetProductWithBbdTaskLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetProductWithBbdTaskQuery,
    Types.GetProductWithBbdTaskQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetProductWithBbdTaskQuery,
    Types.GetProductWithBbdTaskQueryVariables
  >(GetProductWithBbdTaskDocument, options);
}
export type GetProductWithBbdTaskQueryHookResult = ReturnType<typeof useGetProductWithBbdTaskQuery>;
export type GetProductWithBbdTaskLazyQueryHookResult = ReturnType<
  typeof useGetProductWithBbdTaskLazyQuery
>;
export type GetProductWithBbdTaskQueryResult = Apollo.QueryResult<
  Types.GetProductWithBbdTaskQuery,
  Types.GetProductWithBbdTaskQueryVariables
>;
export const ValidateEoyCheckDocument = gql`
  mutation validateEoyCheck($input: ValidateEoyCheckInput!) {
    validateEoyCheck(input: $input) {
      success
    }
  }
`;
export type ValidateEoyCheckMutationFn = Apollo.MutationFunction<
  Types.ValidateEoyCheckMutation,
  Types.ValidateEoyCheckMutationVariables
>;

/**
 * __useValidateEoyCheckMutation__
 *
 * To run a mutation, you first call `useValidateEoyCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateEoyCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateEoyCheckMutation, { data, loading, error }] = useValidateEoyCheckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useValidateEoyCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.ValidateEoyCheckMutation,
    Types.ValidateEoyCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.ValidateEoyCheckMutation,
    Types.ValidateEoyCheckMutationVariables
  >(ValidateEoyCheckDocument, options);
}
export type ValidateEoyCheckMutationHookResult = ReturnType<typeof useValidateEoyCheckMutation>;
export type ValidateEoyCheckMutationResult = Apollo.MutationResult<Types.ValidateEoyCheckMutation>;
export type ValidateEoyCheckMutationOptions = Apollo.BaseMutationOptions<
  Types.ValidateEoyCheckMutation,
  Types.ValidateEoyCheckMutationVariables
>;
export const ValidateFreshnessCheckDocument = gql`
  mutation ValidateFreshnessCheck($input: ValidateFreshnessCheckInput!) {
    validateFreshnessCheck(input: $input) {
      success
    }
  }
`;
export type ValidateFreshnessCheckMutationFn = Apollo.MutationFunction<
  Types.ValidateFreshnessCheckMutation,
  Types.ValidateFreshnessCheckMutationVariables
>;

/**
 * __useValidateFreshnessCheckMutation__
 *
 * To run a mutation, you first call `useValidateFreshnessCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateFreshnessCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateFreshnessCheckMutation, { data, loading, error }] = useValidateFreshnessCheckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useValidateFreshnessCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.ValidateFreshnessCheckMutation,
    Types.ValidateFreshnessCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.ValidateFreshnessCheckMutation,
    Types.ValidateFreshnessCheckMutationVariables
  >(ValidateFreshnessCheckDocument, options);
}
export type ValidateFreshnessCheckMutationHookResult = ReturnType<
  typeof useValidateFreshnessCheckMutation
>;
export type ValidateFreshnessCheckMutationResult =
  Apollo.MutationResult<Types.ValidateFreshnessCheckMutation>;
export type ValidateFreshnessCheckMutationOptions = Apollo.BaseMutationOptions<
  Types.ValidateFreshnessCheckMutation,
  Types.ValidateFreshnessCheckMutationVariables
>;
export const RestockItemDocument = gql`
  mutation restockItem($input: RestockItemWithSKUAndListIdInput!) {
    restockItem(input: $input) {
      message
    }
  }
`;
export type RestockItemMutationFn = Apollo.MutationFunction<
  Types.RestockItemMutation,
  Types.RestockItemMutationVariables
>;

/**
 * __useRestockItemMutation__
 *
 * To run a mutation, you first call `useRestockItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestockItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restockItemMutation, { data, loading, error }] = useRestockItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRestockItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.RestockItemMutation,
    Types.RestockItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.RestockItemMutation, Types.RestockItemMutationVariables>(
    RestockItemDocument,
    options,
  );
}
export type RestockItemMutationHookResult = ReturnType<typeof useRestockItemMutation>;
export type RestockItemMutationResult = Apollo.MutationResult<Types.RestockItemMutation>;
export type RestockItemMutationOptions = Apollo.BaseMutationOptions<
  Types.RestockItemMutation,
  Types.RestockItemMutationVariables
>;
export const DeletePrivateRestockingListDocument = gql`
  mutation deletePrivateRestockingList($input: PrivateListIdInput!) {
    deletePrivateRestockingList(input: $input) {
      message
      success
    }
  }
`;
export type DeletePrivateRestockingListMutationFn = Apollo.MutationFunction<
  Types.DeletePrivateRestockingListMutation,
  Types.DeletePrivateRestockingListMutationVariables
>;

/**
 * __useDeletePrivateRestockingListMutation__
 *
 * To run a mutation, you first call `useDeletePrivateRestockingListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePrivateRestockingListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePrivateRestockingListMutation, { data, loading, error }] = useDeletePrivateRestockingListMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeletePrivateRestockingListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.DeletePrivateRestockingListMutation,
    Types.DeletePrivateRestockingListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.DeletePrivateRestockingListMutation,
    Types.DeletePrivateRestockingListMutationVariables
  >(DeletePrivateRestockingListDocument, options);
}
export type DeletePrivateRestockingListMutationHookResult = ReturnType<
  typeof useDeletePrivateRestockingListMutation
>;
export type DeletePrivateRestockingListMutationResult =
  Apollo.MutationResult<Types.DeletePrivateRestockingListMutation>;
export type DeletePrivateRestockingListMutationOptions = Apollo.BaseMutationOptions<
  Types.DeletePrivateRestockingListMutation,
  Types.DeletePrivateRestockingListMutationVariables
>;
export const RemoveItemFromRestockingPrivateListDocument = gql`
  mutation removeItemFromRestockingPrivateList($input: RestockItemWithSKUAndListIdInput!) {
    removeItemFromRestockingPrivateList(input: $input) {
      message
    }
  }
`;
export type RemoveItemFromRestockingPrivateListMutationFn = Apollo.MutationFunction<
  Types.RemoveItemFromRestockingPrivateListMutation,
  Types.RemoveItemFromRestockingPrivateListMutationVariables
>;

/**
 * __useRemoveItemFromRestockingPrivateListMutation__
 *
 * To run a mutation, you first call `useRemoveItemFromRestockingPrivateListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveItemFromRestockingPrivateListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeItemFromRestockingPrivateListMutation, { data, loading, error }] = useRemoveItemFromRestockingPrivateListMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveItemFromRestockingPrivateListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.RemoveItemFromRestockingPrivateListMutation,
    Types.RemoveItemFromRestockingPrivateListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.RemoveItemFromRestockingPrivateListMutation,
    Types.RemoveItemFromRestockingPrivateListMutationVariables
  >(RemoveItemFromRestockingPrivateListDocument, options);
}
export type RemoveItemFromRestockingPrivateListMutationHookResult = ReturnType<
  typeof useRemoveItemFromRestockingPrivateListMutation
>;
export type RemoveItemFromRestockingPrivateListMutationResult =
  Apollo.MutationResult<Types.RemoveItemFromRestockingPrivateListMutation>;
export type RemoveItemFromRestockingPrivateListMutationOptions = Apollo.BaseMutationOptions<
  Types.RemoveItemFromRestockingPrivateListMutation,
  Types.RemoveItemFromRestockingPrivateListMutationVariables
>;
export const CreatePrivateRestockingListDocument = gql`
  mutation createPrivateRestockingList($input: CreatePrivateRestockingListInput!) {
    createPrivateRestockingList(input: $input) {
      id
    }
  }
`;
export type CreatePrivateRestockingListMutationFn = Apollo.MutationFunction<
  Types.CreatePrivateRestockingListMutation,
  Types.CreatePrivateRestockingListMutationVariables
>;

/**
 * __useCreatePrivateRestockingListMutation__
 *
 * To run a mutation, you first call `useCreatePrivateRestockingListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePrivateRestockingListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPrivateRestockingListMutation, { data, loading, error }] = useCreatePrivateRestockingListMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePrivateRestockingListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.CreatePrivateRestockingListMutation,
    Types.CreatePrivateRestockingListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.CreatePrivateRestockingListMutation,
    Types.CreatePrivateRestockingListMutationVariables
  >(CreatePrivateRestockingListDocument, options);
}
export type CreatePrivateRestockingListMutationHookResult = ReturnType<
  typeof useCreatePrivateRestockingListMutation
>;
export type CreatePrivateRestockingListMutationResult =
  Apollo.MutationResult<Types.CreatePrivateRestockingListMutation>;
export type CreatePrivateRestockingListMutationOptions = Apollo.BaseMutationOptions<
  Types.CreatePrivateRestockingListMutation,
  Types.CreatePrivateRestockingListMutationVariables
>;
export const SaveSkuToPublicRestockingListDocument = gql`
  mutation saveSkuToPublicRestockingList($input: RestockingItemInput!) {
    saveSkuToPublicRestockingList(input: $input) {
      success
    }
  }
`;
export type SaveSkuToPublicRestockingListMutationFn = Apollo.MutationFunction<
  Types.SaveSkuToPublicRestockingListMutation,
  Types.SaveSkuToPublicRestockingListMutationVariables
>;

/**
 * __useSaveSkuToPublicRestockingListMutation__
 *
 * To run a mutation, you first call `useSaveSkuToPublicRestockingListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveSkuToPublicRestockingListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveSkuToPublicRestockingListMutation, { data, loading, error }] = useSaveSkuToPublicRestockingListMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveSkuToPublicRestockingListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.SaveSkuToPublicRestockingListMutation,
    Types.SaveSkuToPublicRestockingListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.SaveSkuToPublicRestockingListMutation,
    Types.SaveSkuToPublicRestockingListMutationVariables
  >(SaveSkuToPublicRestockingListDocument, options);
}
export type SaveSkuToPublicRestockingListMutationHookResult = ReturnType<
  typeof useSaveSkuToPublicRestockingListMutation
>;
export type SaveSkuToPublicRestockingListMutationResult =
  Apollo.MutationResult<Types.SaveSkuToPublicRestockingListMutation>;
export type SaveSkuToPublicRestockingListMutationOptions = Apollo.BaseMutationOptions<
  Types.SaveSkuToPublicRestockingListMutation,
  Types.SaveSkuToPublicRestockingListMutationVariables
>;
export const GetPrivateRestockingListDocument = gql`
  query getPrivateRestockingList {
    getPrivateRestockingList {
      id
      restockingItems {
        status
        sku
        product {
          sku
          name
          imageUrl
          bio
          numberOfShelfFacings
          isShelvedInHandlingUnits
          countryOfOrigin {
            code
          }
          inventoryEntry {
            shelfNumber
            stock {
              shelf
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetPrivateRestockingListQuery__
 *
 * To run a query within a React component, call `useGetPrivateRestockingListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPrivateRestockingListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPrivateRestockingListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPrivateRestockingListQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.GetPrivateRestockingListQuery,
    Types.GetPrivateRestockingListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetPrivateRestockingListQuery,
    Types.GetPrivateRestockingListQueryVariables
  >(GetPrivateRestockingListDocument, options);
}
export function useGetPrivateRestockingListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetPrivateRestockingListQuery,
    Types.GetPrivateRestockingListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetPrivateRestockingListQuery,
    Types.GetPrivateRestockingListQueryVariables
  >(GetPrivateRestockingListDocument, options);
}
export type GetPrivateRestockingListQueryHookResult = ReturnType<
  typeof useGetPrivateRestockingListQuery
>;
export type GetPrivateRestockingListLazyQueryHookResult = ReturnType<
  typeof useGetPrivateRestockingListLazyQuery
>;
export type GetPrivateRestockingListQueryResult = Apollo.QueryResult<
  Types.GetPrivateRestockingListQuery,
  Types.GetPrivateRestockingListQueryVariables
>;
export const SearchRestockingProductsByTextDocument = gql`
  query searchRestockingProductsByText($searchProductsByTextInput: SearchUnitsByTextInput!) {
    searchUnitsByText(searchUnitsByTextInput: $searchProductsByTextInput) {
      units {
        product {
          sku
          imageUrl
          name
          inventoryEntry {
            shelfNumber
            stock {
              shelf
            }
          }
          countryOfOrigin {
            code
          }
          bio
        }
      }
    }
  }
`;

/**
 * __useSearchRestockingProductsByTextQuery__
 *
 * To run a query within a React component, call `useSearchRestockingProductsByTextQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchRestockingProductsByTextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchRestockingProductsByTextQuery({
 *   variables: {
 *      searchProductsByTextInput: // value for 'searchProductsByTextInput'
 *   },
 * });
 */
export function useSearchRestockingProductsByTextQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SearchRestockingProductsByTextQuery,
    Types.SearchRestockingProductsByTextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.SearchRestockingProductsByTextQuery,
    Types.SearchRestockingProductsByTextQueryVariables
  >(SearchRestockingProductsByTextDocument, options);
}
export function useSearchRestockingProductsByTextLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchRestockingProductsByTextQuery,
    Types.SearchRestockingProductsByTextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.SearchRestockingProductsByTextQuery,
    Types.SearchRestockingProductsByTextQueryVariables
  >(SearchRestockingProductsByTextDocument, options);
}
export type SearchRestockingProductsByTextQueryHookResult = ReturnType<
  typeof useSearchRestockingProductsByTextQuery
>;
export type SearchRestockingProductsByTextLazyQueryHookResult = ReturnType<
  typeof useSearchRestockingProductsByTextLazyQuery
>;
export type SearchRestockingProductsByTextQueryResult = Apollo.QueryResult<
  Types.SearchRestockingProductsByTextQuery,
  Types.SearchRestockingProductsByTextQueryVariables
>;
export const GetPublicRestockingListDocument = gql`
  query getPublicRestockingList {
    getPublicRestockingList {
      publicRestockingList {
        hubSlug
        restockingItems {
          sku
          product {
            sku
            imageUrl
            name
            bio
            countryOfOrigin {
              code
            }
            inventoryEntry {
              shelfNumber
              stock {
                shelf
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetPublicRestockingListQuery__
 *
 * To run a query within a React component, call `useGetPublicRestockingListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicRestockingListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicRestockingListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPublicRestockingListQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.GetPublicRestockingListQuery,
    Types.GetPublicRestockingListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetPublicRestockingListQuery,
    Types.GetPublicRestockingListQueryVariables
  >(GetPublicRestockingListDocument, options);
}
export function useGetPublicRestockingListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetPublicRestockingListQuery,
    Types.GetPublicRestockingListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetPublicRestockingListQuery,
    Types.GetPublicRestockingListQueryVariables
  >(GetPublicRestockingListDocument, options);
}
export type GetPublicRestockingListQueryHookResult = ReturnType<
  typeof useGetPublicRestockingListQuery
>;
export type GetPublicRestockingListLazyQueryHookResult = ReturnType<
  typeof useGetPublicRestockingListLazyQuery
>;
export type GetPublicRestockingListQueryResult = Apollo.QueryResult<
  Types.GetPublicRestockingListQuery,
  Types.GetPublicRestockingListQueryVariables
>;
export const ResolveEaNtoSkusDocument = gql`
  query resolveEANtoSkus($input: SearchUnitsByEanInput!) {
    searchUnitsByEan(searchUnitsByEanInput: $input) {
      units {
        productSku
      }
    }
  }
`;

/**
 * __useResolveEaNtoSkusQuery__
 *
 * To run a query within a React component, call `useResolveEaNtoSkusQuery` and pass it any options that fit your needs.
 * When your component renders, `useResolveEaNtoSkusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResolveEaNtoSkusQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResolveEaNtoSkusQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.ResolveEaNtoSkusQuery,
    Types.ResolveEaNtoSkusQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.ResolveEaNtoSkusQuery, Types.ResolveEaNtoSkusQueryVariables>(
    ResolveEaNtoSkusDocument,
    options,
  );
}
export function useResolveEaNtoSkusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.ResolveEaNtoSkusQuery,
    Types.ResolveEaNtoSkusQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.ResolveEaNtoSkusQuery, Types.ResolveEaNtoSkusQueryVariables>(
    ResolveEaNtoSkusDocument,
    options,
  );
}
export type ResolveEaNtoSkusQueryHookResult = ReturnType<typeof useResolveEaNtoSkusQuery>;
export type ResolveEaNtoSkusLazyQueryHookResult = ReturnType<typeof useResolveEaNtoSkusLazyQuery>;
export type ResolveEaNtoSkusQueryResult = Apollo.QueryResult<
  Types.ResolveEaNtoSkusQuery,
  Types.ResolveEaNtoSkusQueryVariables
>;
export const ValidateStockCheckDocument = gql`
  mutation ValidateStockCheck($input: ValidateStockCheckInput!) {
    validateStockCheck(input: $input) {
      success
    }
  }
`;
export type ValidateStockCheckMutationFn = Apollo.MutationFunction<
  Types.ValidateStockCheckMutation,
  Types.ValidateStockCheckMutationVariables
>;

/**
 * __useValidateStockCheckMutation__
 *
 * To run a mutation, you first call `useValidateStockCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateStockCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateStockCheckMutation, { data, loading, error }] = useValidateStockCheckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useValidateStockCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.ValidateStockCheckMutation,
    Types.ValidateStockCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.ValidateStockCheckMutation,
    Types.ValidateStockCheckMutationVariables
  >(ValidateStockCheckDocument, options);
}
export type ValidateStockCheckMutationHookResult = ReturnType<typeof useValidateStockCheckMutation>;
export type ValidateStockCheckMutationResult =
  Apollo.MutationResult<Types.ValidateStockCheckMutation>;
export type ValidateStockCheckMutationOptions = Apollo.BaseMutationOptions<
  Types.ValidateStockCheckMutation,
  Types.ValidateStockCheckMutationVariables
>;
export const SearchProductsByEanDocument = gql`
  query searchProductsByEan($searchProductsByEanInput: SearchUnitsByEanInput!) {
    searchUnitsByEan(searchUnitsByEanInput: $searchProductsByEanInput) {
      units {
        product {
          sku
          imageUrl
          name
          inventoryEntry {
            shelfNumber
            stock {
              shelf
            }
          }
          countryOfOrigin {
            code
          }
          bio
        }
        productSku
        quantity
        type
      }
    }
  }
`;

/**
 * __useSearchProductsByEanQuery__
 *
 * To run a query within a React component, call `useSearchProductsByEanQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductsByEanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductsByEanQuery({
 *   variables: {
 *      searchProductsByEanInput: // value for 'searchProductsByEanInput'
 *   },
 * });
 */
export function useSearchProductsByEanQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SearchProductsByEanQuery,
    Types.SearchProductsByEanQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.SearchProductsByEanQuery, Types.SearchProductsByEanQueryVariables>(
    SearchProductsByEanDocument,
    options,
  );
}
export function useSearchProductsByEanLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchProductsByEanQuery,
    Types.SearchProductsByEanQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.SearchProductsByEanQuery,
    Types.SearchProductsByEanQueryVariables
  >(SearchProductsByEanDocument, options);
}
export type SearchProductsByEanQueryHookResult = ReturnType<typeof useSearchProductsByEanQuery>;
export type SearchProductsByEanLazyQueryHookResult = ReturnType<
  typeof useSearchProductsByEanLazyQuery
>;
export type SearchProductsByEanQueryResult = Apollo.QueryResult<
  Types.SearchProductsByEanQuery,
  Types.SearchProductsByEanQueryVariables
>;
export const GetProductsByShelfDocument = gql`
  query getProductsByShelf($input: GetInventoryEntriesByShelfInput!) {
    getInventoryEntriesByShelf(input: $input) {
      inventoryEntries {
        product {
          imageUrl
          name
          sku
          inventoryEntry {
            shelfNumber
            stock {
              shelf
            }
          }
          countryOfOrigin {
            code
          }
          bio
        }
      }
    }
  }
`;

/**
 * __useGetProductsByShelfQuery__
 *
 * To run a query within a React component, call `useGetProductsByShelfQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsByShelfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsByShelfQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetProductsByShelfQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.GetProductsByShelfQuery,
    Types.GetProductsByShelfQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.GetProductsByShelfQuery, Types.GetProductsByShelfQueryVariables>(
    GetProductsByShelfDocument,
    options,
  );
}
export function useGetProductsByShelfLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetProductsByShelfQuery,
    Types.GetProductsByShelfQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.GetProductsByShelfQuery, Types.GetProductsByShelfQueryVariables>(
    GetProductsByShelfDocument,
    options,
  );
}
export type GetProductsByShelfQueryHookResult = ReturnType<typeof useGetProductsByShelfQuery>;
export type GetProductsByShelfLazyQueryHookResult = ReturnType<
  typeof useGetProductsByShelfLazyQuery
>;
export type GetProductsByShelfQueryResult = Apollo.QueryResult<
  Types.GetProductsByShelfQuery,
  Types.GetProductsByShelfQueryVariables
>;
export const SearchInventoryUnitsByTextDocument = gql`
  query searchInventoryUnitsByText($searchProductsByTextInput: SearchUnitsByTextInput!) {
    searchUnitsByText(searchUnitsByTextInput: $searchProductsByTextInput) {
      units {
        product {
          sku
          imageUrl
          name
          inventoryEntry {
            shelfNumber
            stock {
              shelf
            }
          }
          countryOfOrigin {
            code
          }
          bio
        }
        productSku
        quantity
        type
      }
    }
  }
`;

/**
 * __useSearchInventoryUnitsByTextQuery__
 *
 * To run a query within a React component, call `useSearchInventoryUnitsByTextQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchInventoryUnitsByTextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchInventoryUnitsByTextQuery({
 *   variables: {
 *      searchProductsByTextInput: // value for 'searchProductsByTextInput'
 *   },
 * });
 */
export function useSearchInventoryUnitsByTextQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SearchInventoryUnitsByTextQuery,
    Types.SearchInventoryUnitsByTextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.SearchInventoryUnitsByTextQuery,
    Types.SearchInventoryUnitsByTextQueryVariables
  >(SearchInventoryUnitsByTextDocument, options);
}
export function useSearchInventoryUnitsByTextLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchInventoryUnitsByTextQuery,
    Types.SearchInventoryUnitsByTextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.SearchInventoryUnitsByTextQuery,
    Types.SearchInventoryUnitsByTextQueryVariables
  >(SearchInventoryUnitsByTextDocument, options);
}
export type SearchInventoryUnitsByTextQueryHookResult = ReturnType<
  typeof useSearchInventoryUnitsByTextQuery
>;
export type SearchInventoryUnitsByTextLazyQueryHookResult = ReturnType<
  typeof useSearchInventoryUnitsByTextLazyQuery
>;
export type SearchInventoryUnitsByTextQueryResult = Apollo.QueryResult<
  Types.SearchInventoryUnitsByTextQuery,
  Types.SearchInventoryUnitsByTextQueryVariables
>;
export const CreateCheckDocument = gql`
  mutation CreateCheck($input: CreateCheckInput!) {
    createCheck(input: $input) {
      success
    }
  }
`;
export type CreateCheckMutationFn = Apollo.MutationFunction<
  Types.CreateCheckMutation,
  Types.CreateCheckMutationVariables
>;

/**
 * __useCreateCheckMutation__
 *
 * To run a mutation, you first call `useCreateCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCheckMutation, { data, loading, error }] = useCreateCheckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.CreateCheckMutation,
    Types.CreateCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.CreateCheckMutation, Types.CreateCheckMutationVariables>(
    CreateCheckDocument,
    options,
  );
}
export type CreateCheckMutationHookResult = ReturnType<typeof useCreateCheckMutation>;
export type CreateCheckMutationResult = Apollo.MutationResult<Types.CreateCheckMutation>;
export type CreateCheckMutationOptions = Apollo.BaseMutationOptions<
  Types.CreateCheckMutation,
  Types.CreateCheckMutationVariables
>;
export const UpdateProductStockByDeltaAndMultipleReasonsDocument = gql`
  mutation updateProductStockByDeltaAndMultipleReasons(
    $updateProductStockByDeltaAndMultipleReasonsInput: UpdateProductStockByDeltaAndMultipleReasonsInput!
  ) {
    updateProductStockByDeltaAndMultipleReasons(
      UpdateProductStockByDeltaAndMultipleReasonsInput: $updateProductStockByDeltaAndMultipleReasonsInput
    ) {
      updateResults {
        success
      }
    }
  }
`;
export type UpdateProductStockByDeltaAndMultipleReasonsMutationFn = Apollo.MutationFunction<
  Types.UpdateProductStockByDeltaAndMultipleReasonsMutation,
  Types.UpdateProductStockByDeltaAndMultipleReasonsMutationVariables
>;

/**
 * __useUpdateProductStockByDeltaAndMultipleReasonsMutation__
 *
 * To run a mutation, you first call `useUpdateProductStockByDeltaAndMultipleReasonsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductStockByDeltaAndMultipleReasonsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductStockByDeltaAndMultipleReasonsMutation, { data, loading, error }] = useUpdateProductStockByDeltaAndMultipleReasonsMutation({
 *   variables: {
 *      updateProductStockByDeltaAndMultipleReasonsInput: // value for 'updateProductStockByDeltaAndMultipleReasonsInput'
 *   },
 * });
 */
export function useUpdateProductStockByDeltaAndMultipleReasonsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.UpdateProductStockByDeltaAndMultipleReasonsMutation,
    Types.UpdateProductStockByDeltaAndMultipleReasonsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.UpdateProductStockByDeltaAndMultipleReasonsMutation,
    Types.UpdateProductStockByDeltaAndMultipleReasonsMutationVariables
  >(UpdateProductStockByDeltaAndMultipleReasonsDocument, options);
}
export type UpdateProductStockByDeltaAndMultipleReasonsMutationHookResult = ReturnType<
  typeof useUpdateProductStockByDeltaAndMultipleReasonsMutation
>;
export type UpdateProductStockByDeltaAndMultipleReasonsMutationResult =
  Apollo.MutationResult<Types.UpdateProductStockByDeltaAndMultipleReasonsMutation>;
export type UpdateProductStockByDeltaAndMultipleReasonsMutationOptions = Apollo.BaseMutationOptions<
  Types.UpdateProductStockByDeltaAndMultipleReasonsMutation,
  Types.UpdateProductStockByDeltaAndMultipleReasonsMutationVariables
>;
export const StartInventoryCheckDocument = gql`
  mutation StartInventoryCheck($checkId: ID!) {
    startCheck(input: { checkId: $checkId }) {
      success
    }
  }
`;
export type StartInventoryCheckMutationFn = Apollo.MutationFunction<
  Types.StartInventoryCheckMutation,
  Types.StartInventoryCheckMutationVariables
>;

/**
 * __useStartInventoryCheckMutation__
 *
 * To run a mutation, you first call `useStartInventoryCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartInventoryCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startInventoryCheckMutation, { data, loading, error }] = useStartInventoryCheckMutation({
 *   variables: {
 *      checkId: // value for 'checkId'
 *   },
 * });
 */
export function useStartInventoryCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.StartInventoryCheckMutation,
    Types.StartInventoryCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.StartInventoryCheckMutation,
    Types.StartInventoryCheckMutationVariables
  >(StartInventoryCheckDocument, options);
}
export type StartInventoryCheckMutationHookResult = ReturnType<
  typeof useStartInventoryCheckMutation
>;
export type StartInventoryCheckMutationResult =
  Apollo.MutationResult<Types.StartInventoryCheckMutation>;
export type StartInventoryCheckMutationOptions = Apollo.BaseMutationOptions<
  Types.StartInventoryCheckMutation,
  Types.StartInventoryCheckMutationVariables
>;
export const GetProductStockDocument = gql`
  query getProductStock($sku: ID!) {
    getProduct(input: { sku: $sku }) {
      inventoryEntry {
        stock {
          shelf
        }
      }
    }
  }
`;

/**
 * __useGetProductStockQuery__
 *
 * To run a query within a React component, call `useGetProductStockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductStockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductStockQuery({
 *   variables: {
 *      sku: // value for 'sku'
 *   },
 * });
 */
export function useGetProductStockQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.GetProductStockQuery,
    Types.GetProductStockQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.GetProductStockQuery, Types.GetProductStockQueryVariables>(
    GetProductStockDocument,
    options,
  );
}
export function useGetProductStockLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetProductStockQuery,
    Types.GetProductStockQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.GetProductStockQuery, Types.GetProductStockQueryVariables>(
    GetProductStockDocument,
    options,
  );
}
export type GetProductStockQueryHookResult = ReturnType<typeof useGetProductStockQuery>;
export type GetProductStockLazyQueryHookResult = ReturnType<typeof useGetProductStockLazyQuery>;
export type GetProductStockQueryResult = Apollo.QueryResult<
  Types.GetProductStockQuery,
  Types.GetProductStockQueryVariables
>;
export const GetTaskByIdDocument = gql`
  query GetTaskById($taskId: ID!) {
    getTaskById(input: { taskId: $taskId }) {
      task {
        id
        priority
        product {
          sku
          name
          imageUrl
          countryOfOrigin {
            code
          }
          minDaysToBestBeforeDate
        }
        productSku
        shelfNumber
        type
        status
      }
    }
  }
`;

/**
 * __useGetTaskByIdQuery__
 *
 * To run a query within a React component, call `useGetTaskByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTaskByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTaskByIdQuery({
 *   variables: {
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useGetTaskByIdQuery(
  baseOptions: Apollo.QueryHookOptions<Types.GetTaskByIdQuery, Types.GetTaskByIdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.GetTaskByIdQuery, Types.GetTaskByIdQueryVariables>(
    GetTaskByIdDocument,
    options,
  );
}
export function useGetTaskByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetTaskByIdQuery,
    Types.GetTaskByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.GetTaskByIdQuery, Types.GetTaskByIdQueryVariables>(
    GetTaskByIdDocument,
    options,
  );
}
export type GetTaskByIdQueryHookResult = ReturnType<typeof useGetTaskByIdQuery>;
export type GetTaskByIdLazyQueryHookResult = ReturnType<typeof useGetTaskByIdLazyQuery>;
export type GetTaskByIdQueryResult = Apollo.QueryResult<
  Types.GetTaskByIdQuery,
  Types.GetTaskByIdQueryVariables
>;
export const InventoryHubNextCheckDocument = gql`
  query InventoryHubNextCheck {
    getNextCheckForHub {
      check {
        id
        priority
        shelfNumber
        type
        status
        product {
          sku
          name
          imageUrl
          countryOfOrigin {
            code
          }
        }
      }
    }
  }
`;

/**
 * __useInventoryHubNextCheckQuery__
 *
 * To run a query within a React component, call `useInventoryHubNextCheckQuery` and pass it any options that fit your needs.
 * When your component renders, `useInventoryHubNextCheckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInventoryHubNextCheckQuery({
 *   variables: {
 *   },
 * });
 */
export function useInventoryHubNextCheckQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.InventoryHubNextCheckQuery,
    Types.InventoryHubNextCheckQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.InventoryHubNextCheckQuery,
    Types.InventoryHubNextCheckQueryVariables
  >(InventoryHubNextCheckDocument, options);
}
export function useInventoryHubNextCheckLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.InventoryHubNextCheckQuery,
    Types.InventoryHubNextCheckQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.InventoryHubNextCheckQuery,
    Types.InventoryHubNextCheckQueryVariables
  >(InventoryHubNextCheckDocument, options);
}
export type InventoryHubNextCheckQueryHookResult = ReturnType<typeof useInventoryHubNextCheckQuery>;
export type InventoryHubNextCheckLazyQueryHookResult = ReturnType<
  typeof useInventoryHubNextCheckLazyQuery
>;
export type InventoryHubNextCheckQueryResult = Apollo.QueryResult<
  Types.InventoryHubNextCheckQuery,
  Types.InventoryHubNextCheckQueryVariables
>;
export const InventoryPendingCheckCountDocument = gql`
  query InventoryPendingCheckCount($input: CheckFilters) {
    getOpenedChecksCountForHub(input: $input) {
      checkCount: pendingChecksCount
    }
  }
`;

/**
 * __useInventoryPendingCheckCountQuery__
 *
 * To run a query within a React component, call `useInventoryPendingCheckCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useInventoryPendingCheckCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInventoryPendingCheckCountQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInventoryPendingCheckCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.InventoryPendingCheckCountQuery,
    Types.InventoryPendingCheckCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.InventoryPendingCheckCountQuery,
    Types.InventoryPendingCheckCountQueryVariables
  >(InventoryPendingCheckCountDocument, options);
}
export function useInventoryPendingCheckCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.InventoryPendingCheckCountQuery,
    Types.InventoryPendingCheckCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.InventoryPendingCheckCountQuery,
    Types.InventoryPendingCheckCountQueryVariables
  >(InventoryPendingCheckCountDocument, options);
}
export type InventoryPendingCheckCountQueryHookResult = ReturnType<
  typeof useInventoryPendingCheckCountQuery
>;
export type InventoryPendingCheckCountLazyQueryHookResult = ReturnType<
  typeof useInventoryPendingCheckCountLazyQuery
>;
export type InventoryPendingCheckCountQueryResult = Apollo.QueryResult<
  Types.InventoryPendingCheckCountQuery,
  Types.InventoryPendingCheckCountQueryVariables
>;
export const InventoryPendingChecksDocument = gql`
  query InventoryPendingChecks($input: CheckFilters) {
    getPendingChecks(input: $input) {
      checks {
        id
        priority
        shelfNumber
        type
      }
    }
  }
`;

/**
 * __useInventoryPendingChecksQuery__
 *
 * To run a query within a React component, call `useInventoryPendingChecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useInventoryPendingChecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInventoryPendingChecksQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInventoryPendingChecksQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.InventoryPendingChecksQuery,
    Types.InventoryPendingChecksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.InventoryPendingChecksQuery,
    Types.InventoryPendingChecksQueryVariables
  >(InventoryPendingChecksDocument, options);
}
export function useInventoryPendingChecksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.InventoryPendingChecksQuery,
    Types.InventoryPendingChecksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.InventoryPendingChecksQuery,
    Types.InventoryPendingChecksQueryVariables
  >(InventoryPendingChecksDocument, options);
}
export type InventoryPendingChecksQueryHookResult = ReturnType<
  typeof useInventoryPendingChecksQuery
>;
export type InventoryPendingChecksLazyQueryHookResult = ReturnType<
  typeof useInventoryPendingChecksLazyQuery
>;
export type InventoryPendingChecksQueryResult = Apollo.QueryResult<
  Types.InventoryPendingChecksQuery,
  Types.InventoryPendingChecksQueryVariables
>;
export const InventoryShelfNextCheckDocument = gql`
  query InventoryShelfNextCheck($shelfNumber: String!, $filters: CheckFilters) {
    getNextCheckForShelf(input: { shelfNumber: $shelfNumber, filters: $filters }) {
      check {
        id
        priority
        product {
          sku
          name
          imageUrl
          countryOfOrigin {
            code
          }
        }
        productSku
        shelfNumber
        type
        status
      }
    }
  }
`;

/**
 * __useInventoryShelfNextCheckQuery__
 *
 * To run a query within a React component, call `useInventoryShelfNextCheckQuery` and pass it any options that fit your needs.
 * When your component renders, `useInventoryShelfNextCheckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInventoryShelfNextCheckQuery({
 *   variables: {
 *      shelfNumber: // value for 'shelfNumber'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useInventoryShelfNextCheckQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.InventoryShelfNextCheckQuery,
    Types.InventoryShelfNextCheckQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.InventoryShelfNextCheckQuery,
    Types.InventoryShelfNextCheckQueryVariables
  >(InventoryShelfNextCheckDocument, options);
}
export function useInventoryShelfNextCheckLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.InventoryShelfNextCheckQuery,
    Types.InventoryShelfNextCheckQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.InventoryShelfNextCheckQuery,
    Types.InventoryShelfNextCheckQueryVariables
  >(InventoryShelfNextCheckDocument, options);
}
export type InventoryShelfNextCheckQueryHookResult = ReturnType<
  typeof useInventoryShelfNextCheckQuery
>;
export type InventoryShelfNextCheckLazyQueryHookResult = ReturnType<
  typeof useInventoryShelfNextCheckLazyQuery
>;
export type InventoryShelfNextCheckQueryResult = Apollo.QueryResult<
  Types.InventoryShelfNextCheckQuery,
  Types.InventoryShelfNextCheckQueryVariables
>;
export const StartPickingDocument = gql`
  mutation startPicking($orderNumber: String!) {
    startPickingV2(orderNumber: $orderNumber) {
      order {
        ...orderFragment
        items {
          ...itemFragment
        }
      }
      externalDeliveryProvider
      handoverIdentifier
      deliveryTag
    }
  }
  ${OrderFragmentFragmentDoc}
  ${ItemFragmentFragmentDoc}
`;
export type StartPickingMutationFn = Apollo.MutationFunction<
  Types.StartPickingMutation,
  Types.StartPickingMutationVariables
>;

/**
 * __useStartPickingMutation__
 *
 * To run a mutation, you first call `useStartPickingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartPickingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startPickingMutation, { data, loading, error }] = useStartPickingMutation({
 *   variables: {
 *      orderNumber: // value for 'orderNumber'
 *   },
 * });
 */
export function useStartPickingMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.StartPickingMutation,
    Types.StartPickingMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.StartPickingMutation, Types.StartPickingMutationVariables>(
    StartPickingDocument,
    options,
  );
}
export type StartPickingMutationHookResult = ReturnType<typeof useStartPickingMutation>;
export type StartPickingMutationResult = Apollo.MutationResult<Types.StartPickingMutation>;
export type StartPickingMutationOptions = Apollo.BaseMutationOptions<
  Types.StartPickingMutation,
  Types.StartPickingMutationVariables
>;
export const StartManualPickingDocument = gql`
  mutation startManualPicking($orderNumber: String!) {
    startManualPickingV2(orderNumber: $orderNumber) {
      order {
        ...orderFragment
        items {
          ...itemFragment
        }
      }
      externalDeliveryProvider
      handoverIdentifier
      deliveryTag
    }
  }
  ${OrderFragmentFragmentDoc}
  ${ItemFragmentFragmentDoc}
`;
export type StartManualPickingMutationFn = Apollo.MutationFunction<
  Types.StartManualPickingMutation,
  Types.StartManualPickingMutationVariables
>;

/**
 * __useStartManualPickingMutation__
 *
 * To run a mutation, you first call `useStartManualPickingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartManualPickingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startManualPickingMutation, { data, loading, error }] = useStartManualPickingMutation({
 *   variables: {
 *      orderNumber: // value for 'orderNumber'
 *   },
 * });
 */
export function useStartManualPickingMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.StartManualPickingMutation,
    Types.StartManualPickingMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.StartManualPickingMutation,
    Types.StartManualPickingMutationVariables
  >(StartManualPickingDocument, options);
}
export type StartManualPickingMutationHookResult = ReturnType<typeof useStartManualPickingMutation>;
export type StartManualPickingMutationResult =
  Apollo.MutationResult<Types.StartManualPickingMutation>;
export type StartManualPickingMutationOptions = Apollo.BaseMutationOptions<
  Types.StartManualPickingMutation,
  Types.StartManualPickingMutationVariables
>;
export const EndPickingDocument = gql`
  mutation endPicking(
    $orderNumber: String!
    $missingItems: [MissingItem!]!
    $containersIds: [String!]
    $shelvesIds: [String!]
  ) {
    endPicking(
      orderNumber: $orderNumber
      missingItems: $missingItems
      containersIds: $containersIds
      shelvesIds: $shelvesIds
    ) {
      message
    }
  }
`;
export type EndPickingMutationFn = Apollo.MutationFunction<
  Types.EndPickingMutation,
  Types.EndPickingMutationVariables
>;

/**
 * __useEndPickingMutation__
 *
 * To run a mutation, you first call `useEndPickingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEndPickingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [endPickingMutation, { data, loading, error }] = useEndPickingMutation({
 *   variables: {
 *      orderNumber: // value for 'orderNumber'
 *      missingItems: // value for 'missingItems'
 *      containersIds: // value for 'containersIds'
 *      shelvesIds: // value for 'shelvesIds'
 *   },
 * });
 */
export function useEndPickingMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.EndPickingMutation,
    Types.EndPickingMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.EndPickingMutation, Types.EndPickingMutationVariables>(
    EndPickingDocument,
    options,
  );
}
export type EndPickingMutationHookResult = ReturnType<typeof useEndPickingMutation>;
export type EndPickingMutationResult = Apollo.MutationResult<Types.EndPickingMutation>;
export type EndPickingMutationOptions = Apollo.BaseMutationOptions<
  Types.EndPickingMutation,
  Types.EndPickingMutationVariables
>;
export const NextOrderForPickingDocument = gql`
  query nextOrderForPicking {
    nextOrderForPicking {
      order {
        ...orderFragment
        items {
          ...itemFragment
        }
      }
    }
  }
  ${OrderFragmentFragmentDoc}
  ${ItemFragmentFragmentDoc}
`;

/**
 * __useNextOrderForPickingQuery__
 *
 * To run a query within a React component, call `useNextOrderForPickingQuery` and pass it any options that fit your needs.
 * When your component renders, `useNextOrderForPickingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNextOrderForPickingQuery({
 *   variables: {
 *   },
 * });
 */
export function useNextOrderForPickingQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.NextOrderForPickingQuery,
    Types.NextOrderForPickingQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.NextOrderForPickingQuery, Types.NextOrderForPickingQueryVariables>(
    NextOrderForPickingDocument,
    options,
  );
}
export function useNextOrderForPickingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.NextOrderForPickingQuery,
    Types.NextOrderForPickingQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.NextOrderForPickingQuery,
    Types.NextOrderForPickingQueryVariables
  >(NextOrderForPickingDocument, options);
}
export type NextOrderForPickingQueryHookResult = ReturnType<typeof useNextOrderForPickingQuery>;
export type NextOrderForPickingLazyQueryHookResult = ReturnType<
  typeof useNextOrderForPickingLazyQuery
>;
export type NextOrderForPickingQueryResult = Apollo.QueryResult<
  Types.NextOrderForPickingQuery,
  Types.NextOrderForPickingQueryVariables
>;
export const NextOrderForPickingIdDocument = gql`
  query nextOrderForPickingId {
    nextOrderForPicking {
      order {
        id
        number
      }
    }
  }
`;

/**
 * __useNextOrderForPickingIdQuery__
 *
 * To run a query within a React component, call `useNextOrderForPickingIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useNextOrderForPickingIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNextOrderForPickingIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useNextOrderForPickingIdQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.NextOrderForPickingIdQuery,
    Types.NextOrderForPickingIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.NextOrderForPickingIdQuery,
    Types.NextOrderForPickingIdQueryVariables
  >(NextOrderForPickingIdDocument, options);
}
export function useNextOrderForPickingIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.NextOrderForPickingIdQuery,
    Types.NextOrderForPickingIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.NextOrderForPickingIdQuery,
    Types.NextOrderForPickingIdQueryVariables
  >(NextOrderForPickingIdDocument, options);
}
export type NextOrderForPickingIdQueryHookResult = ReturnType<typeof useNextOrderForPickingIdQuery>;
export type NextOrderForPickingIdLazyQueryHookResult = ReturnType<
  typeof useNextOrderForPickingIdLazyQuery
>;
export type NextOrderForPickingIdQueryResult = Apollo.QueryResult<
  Types.NextOrderForPickingIdQuery,
  Types.NextOrderForPickingIdQueryVariables
>;
export const GetSummaryOfNextOrderToPickDocument = gql`
  query getSummaryOfNextOrderToPick {
    getSummaryOfNextOrderToPick {
      orderSummary {
        id
        number
      }
    }
  }
`;

/**
 * __useGetSummaryOfNextOrderToPickQuery__
 *
 * To run a query within a React component, call `useGetSummaryOfNextOrderToPickQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSummaryOfNextOrderToPickQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSummaryOfNextOrderToPickQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSummaryOfNextOrderToPickQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.GetSummaryOfNextOrderToPickQuery,
    Types.GetSummaryOfNextOrderToPickQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetSummaryOfNextOrderToPickQuery,
    Types.GetSummaryOfNextOrderToPickQueryVariables
  >(GetSummaryOfNextOrderToPickDocument, options);
}
export function useGetSummaryOfNextOrderToPickLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetSummaryOfNextOrderToPickQuery,
    Types.GetSummaryOfNextOrderToPickQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetSummaryOfNextOrderToPickQuery,
    Types.GetSummaryOfNextOrderToPickQueryVariables
  >(GetSummaryOfNextOrderToPickDocument, options);
}
export type GetSummaryOfNextOrderToPickQueryHookResult = ReturnType<
  typeof useGetSummaryOfNextOrderToPickQuery
>;
export type GetSummaryOfNextOrderToPickLazyQueryHookResult = ReturnType<
  typeof useGetSummaryOfNextOrderToPickLazyQuery
>;
export type GetSummaryOfNextOrderToPickQueryResult = Apollo.QueryResult<
  Types.GetSummaryOfNextOrderToPickQuery,
  Types.GetSummaryOfNextOrderToPickQueryVariables
>;
export const GetOrderDocument = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      order {
        ...orderFragment
        items {
          ...itemFragment
        }
      }
    }
  }
  ${OrderFragmentFragmentDoc}
  ${ItemFragmentFragmentDoc}
`;

/**
 * __useGetOrderQuery__
 *
 * To run a query within a React component, call `useGetOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetOrderQuery(
  baseOptions: Apollo.QueryHookOptions<Types.GetOrderQuery, Types.GetOrderQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.GetOrderQuery, Types.GetOrderQueryVariables>(
    GetOrderDocument,
    options,
  );
}
export function useGetOrderLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Types.GetOrderQuery, Types.GetOrderQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.GetOrderQuery, Types.GetOrderQueryVariables>(
    GetOrderDocument,
    options,
  );
}
export type GetOrderQueryHookResult = ReturnType<typeof useGetOrderQuery>;
export type GetOrderLazyQueryHookResult = ReturnType<typeof useGetOrderLazyQuery>;
export type GetOrderQueryResult = Apollo.QueryResult<
  Types.GetOrderQuery,
  Types.GetOrderQueryVariables
>;
export const SearchUnitsByEanDocument = gql`
  query searchUnitsByEan($searchUnitsByEanInput: SearchUnitsByEanInput!) {
    searchUnitsByEan(searchUnitsByEanInput: $searchUnitsByEanInput) {
      units {
        id
        ean
        product {
          imageUrl
          name
          inventoryEntry {
            shelfNumber
            stock {
              shelf
            }
          }
          countryOfOrigin {
            code
          }
          bio
          numberOfShelfFacings
          isShelvedInHandlingUnits
        }
        productSku
        quantity
        type
      }
    }
  }
`;

/**
 * __useSearchUnitsByEanQuery__
 *
 * To run a query within a React component, call `useSearchUnitsByEanQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUnitsByEanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUnitsByEanQuery({
 *   variables: {
 *      searchUnitsByEanInput: // value for 'searchUnitsByEanInput'
 *   },
 * });
 */
export function useSearchUnitsByEanQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SearchUnitsByEanQuery,
    Types.SearchUnitsByEanQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.SearchUnitsByEanQuery, Types.SearchUnitsByEanQueryVariables>(
    SearchUnitsByEanDocument,
    options,
  );
}
export function useSearchUnitsByEanLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchUnitsByEanQuery,
    Types.SearchUnitsByEanQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.SearchUnitsByEanQuery, Types.SearchUnitsByEanQueryVariables>(
    SearchUnitsByEanDocument,
    options,
  );
}
export type SearchUnitsByEanQueryHookResult = ReturnType<typeof useSearchUnitsByEanQuery>;
export type SearchUnitsByEanLazyQueryHookResult = ReturnType<typeof useSearchUnitsByEanLazyQuery>;
export type SearchUnitsByEanQueryResult = Apollo.QueryResult<
  Types.SearchUnitsByEanQuery,
  Types.SearchUnitsByEanQueryVariables
>;
export const SearchInboundUnitsByTextDocument = gql`
  query searchInboundUnitsByText($searchUnitsByTextInput: SearchUnitsByTextInput!) {
    searchUnitsByText(searchUnitsByTextInput: $searchUnitsByTextInput) {
      units {
        id
        ean
        product {
          imageUrl
          name
          inventoryEntry {
            shelfNumber
          }
          countryOfOrigin {
            code
          }
          bio
          numberOfShelfFacings
          isShelvedInHandlingUnits
        }
        productSku
        quantity
        type
      }
      matchType
    }
  }
`;

/**
 * __useSearchInboundUnitsByTextQuery__
 *
 * To run a query within a React component, call `useSearchInboundUnitsByTextQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchInboundUnitsByTextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchInboundUnitsByTextQuery({
 *   variables: {
 *      searchUnitsByTextInput: // value for 'searchUnitsByTextInput'
 *   },
 * });
 */
export function useSearchInboundUnitsByTextQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SearchInboundUnitsByTextQuery,
    Types.SearchInboundUnitsByTextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.SearchInboundUnitsByTextQuery,
    Types.SearchInboundUnitsByTextQueryVariables
  >(SearchInboundUnitsByTextDocument, options);
}
export function useSearchInboundUnitsByTextLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchInboundUnitsByTextQuery,
    Types.SearchInboundUnitsByTextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.SearchInboundUnitsByTextQuery,
    Types.SearchInboundUnitsByTextQueryVariables
  >(SearchInboundUnitsByTextDocument, options);
}
export type SearchInboundUnitsByTextQueryHookResult = ReturnType<
  typeof useSearchInboundUnitsByTextQuery
>;
export type SearchInboundUnitsByTextLazyQueryHookResult = ReturnType<
  typeof useSearchInboundUnitsByTextLazyQuery
>;
export type SearchInboundUnitsByTextQueryResult = Apollo.QueryResult<
  Types.SearchInboundUnitsByTextQuery,
  Types.SearchInboundUnitsByTextQueryVariables
>;
export const GetUnitsSizesDocument = gql`
  query getUnitsSizes($input: GetProductsInput!) {
    getProducts(input: $input) {
      products {
        sku
        units {
          quantity
        }
      }
    }
  }
`;

/**
 * __useGetUnitsSizesQuery__
 *
 * To run a query within a React component, call `useGetUnitsSizesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUnitsSizesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnitsSizesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetUnitsSizesQuery(
  baseOptions: Apollo.QueryHookOptions<Types.GetUnitsSizesQuery, Types.GetUnitsSizesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Types.GetUnitsSizesQuery, Types.GetUnitsSizesQueryVariables>(
    GetUnitsSizesDocument,
    options,
  );
}
export function useGetUnitsSizesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetUnitsSizesQuery,
    Types.GetUnitsSizesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Types.GetUnitsSizesQuery, Types.GetUnitsSizesQueryVariables>(
    GetUnitsSizesDocument,
    options,
  );
}
export type GetUnitsSizesQueryHookResult = ReturnType<typeof useGetUnitsSizesQuery>;
export type GetUnitsSizesLazyQueryHookResult = ReturnType<typeof useGetUnitsSizesLazyQuery>;
export type GetUnitsSizesQueryResult = Apollo.QueryResult<
  Types.GetUnitsSizesQuery,
  Types.GetUnitsSizesQueryVariables
>;
