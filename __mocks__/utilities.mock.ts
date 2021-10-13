import { TDictionaryOrder, TRawOrder } from '../interfaces'

export const orderDictionary = (timeStamp: Date): TDictionaryOrder => {
    return {
        110: { price: 110, size: 20, timeStamp },
        105: { price: 105, size: 4, timeStamp },
        200: { price: 200, size: 7, timeStamp },
        80: { price: 80, size: 16, timeStamp }
    }
}

export const transformedDictionaryOrder = {
    80: { price: 80, size: 16, total: 16 },
    105: { price: 105, size: 4, total: 20 },
    110: { price: 110, size: 20, total: 40 },
    200: { price: 200, size: 7, total: 47 },
}

export const rawOrderData: TRawOrder[] = [
    [110, 20],
    [105, 4],
    [200, 7],
    [80, 16],
]

export const rawOrderData1: TRawOrder[] = [
    [80, 16],
    [105, 4],
    [110, 20],
    [200, 7],
]
