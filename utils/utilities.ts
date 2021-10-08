import { TDictionaryOrder, TRawOrder, TTransformedDictionaryOrder } from '../interfaces'

/**
 * Description: sort orders and calculate total
 * 
 * Example:
 * 
 *   orderDictionary: { 
 *     110: { price: 110,  size: 20, timeStamp: 2021/10/08  },
 *     105: { price: 110,  size: 4, timeStamp: 2021/10/08  },
 *     200: { price: 200,  size: 7, timeStamp: 2021/10/08  },
 *     80: { price: 80,  size: 16, timeStamp: 2021/10/08  },
 *   }
 * 
 *   returns: { 
 *     80: { price: 80,  size: 16, total: 16   },
 *     105: { price: 105,  size: 4, total: 20   },
 *     110: { price: 110,  size: 20, total: 40   },
 *     200: { price: 200,  size: 7, total: 47   },
 *   }
 *
 * @param orderDictionary 
 * @returns {TTransformedDictionaryOrder}
 */

export const sortOrderAndCalculateTotal = (orderDictionary: TDictionaryOrder) => {
    let total = 0;

    // sort orders by price
    const sortedOrderDictionary: TTransformedDictionaryOrder = Object.keys(orderDictionary)
        // Object.keys returns a string of Arrays so i need to pass it from String to float
        .map((key: string) => orderDictionary[parseFloat(key)])
        .sort((a, b) => { return a.price - b.price })
        .filter((k) => k)
        // calculate totals
        .map((sortedData) => {
            const { price, size } = sortedData
            total += size
            return {
                price,
                size,
                total
            }
        })
        .reduce((allOrders, currentOrder) => {
            return {
                ...allOrders,
                [currentOrder.price]: currentOrder,
            };
        }, {});
    return sortedOrderDictionary;
}


/**
 * description: convert order array to dictionary
 * 
 * Example: 
 *          rowOrderData: [
 *              [ 110, 20]  ,       
 *              [ 105, 4]  ,       
 *              [ 200, 7]  ,       
 *              [ 80, 16]  ,       
 *          ]
 * 
 *          returns {
 *                      110: { price: 110, size: 20, timeStamp: new Date() },
 *                      105: { price: 110, size: 4, timeStamp: new Date() },
 *                      200: { price: 200, size: 7, timeStamp: new Date() },
 *                      80: { price: 80, size: 16, timeStamp: new Date() }
 *                  }
 * 
 * @param rawOrderData 
 * @param timeStamp 
 * @returns {TDictionaryOrder}
 */
export const convertArrayOrderToDictionary = (rawOrderData: TRawOrder[], timeStamp: Date) => {
    const orderDictionary: TDictionaryOrder = rawOrderData.reduce(
        (hashedOrder: TDictionaryOrder, currentRawOrder) => {
            const [price, size] = currentRawOrder;
            hashedOrder[Math.floor(price)] = {
                price: Math.floor(price),
                size,
                timeStamp
            }
            return hashedOrder;
        }, {}
    )
    return orderDictionary;
}

// convert order dictionary to array
export const convertDictionaryOrderToArray = (dictionaryOrderData: TDictionaryOrder) => {
    const rawOrderData: TRawOrder[] = Object.keys(dictionaryOrderData)
        .map((key) => {
            const { price, size } = dictionaryOrderData[parseFloat(key)];
            return [price, size]
        })
    return rawOrderData;
}
