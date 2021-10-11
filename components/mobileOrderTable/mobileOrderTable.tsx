import React from 'react'
import { TRawOrder } from '../../interfaces'
import { getColorPercentage } from '../../utils'
import styles from './mobileOrderTable.module.css'

interface iMobileOrderTable {
    totalSize: number,
    bidOrders: TRawOrder[],
    bidColor: string,
    askOrders: TRawOrder[],
    askColor: string
}

export const MobileOrderTable = ({ totalSize, bidOrders, bidColor, askOrders, askColor }: iMobileOrderTable) => {

    const renderBidOrderRow = () => {
        let cumulativeTotalSize = 0
        return bidOrders.map((bidOrder) => {
            const [price, size] = bidOrder;
            cumulativeTotalSize += size;

            return (
                <tr key={`${price}-${bidColor}`} className={styles.rowBid} style={{ backgroundColor: '#01101d', backgroundSize: getColorPercentage(totalSize, cumulativeTotalSize) + "% " }} >
                    <td className='flex_1  bid_price_color' >{price.toLocaleString()} </td>
                    <td className='flex_1' >{size.toLocaleString()}</td>
                    <td className='flex_1'>{cumulativeTotalSize.toLocaleString()}</td>
                </tr>
            )
        })
    }

    const renderAskOrderRow = () => {
        let cumulativeTotalSize = 0
        return askOrders.map((askOrder) => {
            const [price, size] = askOrder;
            cumulativeTotalSize += size;

            return (
                <tr key={`${price}-${askColor}`} className={styles.rowAsk} style={{ backgroundColor: 'rgb(98, 50, 50)', backgroundSize: getColorPercentage(totalSize, cumulativeTotalSize) + "% " }} >
                    <td className='flex_1  ask_price_color' >{price.toLocaleString()} </td>
                    <td className='flex_1' >{size.toLocaleString()}</td>
                    <td className='flex_1'>{cumulativeTotalSize.toLocaleString()}</td>
                </tr>
            )
        })
    }

    return (
        <>
            {/* mobile Ask order table */}
            <table className={styles.orderBookTable}>
                <thead>
                    <tr className={styles.heading}>
                        <th className={styles.head}>PRICE</th>
                        <th className={styles.head}>SIZE</th>
                        <th className={styles.head}>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {renderAskOrderRow()}
                </tbody>
            </table>

            {/* Mobile Spread */}
            <p className={styles.spread}>Spread {(bidOrders[0][0] - askOrders[0][0]).toLocaleString()}</p>

            {/* Mobile Bid Order Table */}
            <table className={styles.orderBookTable}>
                <tbody>
                    {renderBidOrderRow()}
                </tbody>
            </table>
        </>
    )
}