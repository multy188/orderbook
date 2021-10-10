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

export const sortOrderAndCalculateTotal = (orderDictionary: TDictionaryOrder, isAscending = true) => {
    let total = 0;

    // sort orders by price
    let sortedOrder = Object.keys(orderDictionary)
        // Object.keys returns a string of Arrays so i need to pass it from String to float
        .map((key: string) => orderDictionary[parseFloat(key)])
        .sort((a, b) => a.price - b.price)
        .filter((k) => k)
    if (!isAscending) {
        sortedOrder = sortedOrder.reverse()
    }


    // calculate totals
    const sortedOrderDictionary: TTransformedDictionaryOrder = sortedOrder.map((sortedData) => {
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
                [currentOrder.price]: currentOrder,
                ...allOrders
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

/**
 * 
 * @param param0 
 * @returns {Number}
 */
export const getColorPercentage = (totalSize: number, cumulativeTotalSize: number) => {
    let percentageColor = (totalSize ? cumulativeTotalSize / totalSize : 0) * 100;
    // Since percentage cant be less than 0 or greater than 100, i am  getting min and max
    percentageColor = Math.min(percentageColor, 100);
    percentageColor = Math.max(percentageColor, 0);
    return percentageColor;
}