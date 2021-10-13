
import { orderDictionary, transformedDictionaryOrder, rawOrderData, rawOrderData1 } from '../../__mocks__'
import { convertArrayOrderToDictionary, getColorPercentage, convertDictionaryOrderToArray } from '../utilities'

describe('Utilities', () => {
    test('getColorPercentage', () => {
        const percent = getColorPercentage(44800, 900)
        expect(percent).toEqual("2.01")
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