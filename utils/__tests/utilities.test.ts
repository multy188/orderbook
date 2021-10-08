
import { orderDictionary, transformedDictionaryOrder, rawOrderData, rawOrderData1 } from '../../__mocks'
import { convertArrayOrderToDictionary, sortOrderAndCalculateTotal, convertDictionaryOrderToArray } from '../utilities'

describe('Utilities', () => {
    test('sortOrderAndCalculateTotal', () => {
        const transformed = sortOrderAndCalculateTotal(orderDictionary(new Date()))
        expect(transformed).toEqual(transformedDictionaryOrder)
    })

    test('convertArrayOrderToDictionary', () => {
        const timeStamp = new Date()
        const hashOrder = convertArrayOrderToDictionary(rawOrderData, timeStamp)
        expect(hashOrder).toEqual(orderDictionary(timeStamp))
    })

    test('convertDictionaryOrderToArray', () => {
        const timeStamp = new Date()
        const arrayOrder = convertDictionaryOrderToArray(orderDictionary(timeStamp))
        expect(arrayOrder).toEqual(rawOrderData1)
    })
})