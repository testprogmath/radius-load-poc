import gql from 'graphql-tag';

export const START_PICKING_ORDER_MUTATION = gql.default`
    mutation startPicking($orderNumber: String!) {
        startPickingV2(orderNumber: $orderNumber) {
            order {
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
                items {
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
                        imageUrl
                        sku
                    }
                }
            }
            externalDeliveryProvider
            handoverIdentifier
            deliveryTag
        }
    }
`;


export const startManualPickingMutation = gql.default`
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
`;

export const endPickingMutation = gql.default`
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
