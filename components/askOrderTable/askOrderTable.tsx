import React from 'react'
import { TRawOrder } from '../../interfaces'
import { BID_COLOR, getColorPercentage } from '../../utils'
import styles from '../orderTable.module.css'

export const AskOrderTable = ({ totalSize, orders, color }: { totalSize: number, orders: TRawOrder[], color: string }) => {
    const renderOrderRow = () => {
        let cumulativeTotalSize = 0
        return orders.map((order) => {
            const [price, size] = order;
            cumulativeTotalSize += size;
            return (
                <tr key={`${price}-${color}`} className={(color === BID_COLOR) ? styles.rowBid : styles.rowAsk} style={{ backgroundColor: '#01101d', backgroundSize: getColorPercentage(totalSize, cumulativeTotalSize) + "% " }} >
                    <td data-testid={price} className='flex_1 ask_price_color' >{price.toLocaleString()}</td>
                    <td className='flex_1' >{size.toLocaleString()}</td>
                    <td className='flex_1 '>{cumulativeTotalSize.toLocaleString()}</td>
                </tr>
            )
        })
    }

    return (
        <table className={styles.orderBookTable}>
            <thead>
                <tr className={styles.heading}>
                    <th className={styles.head}>PRICE</th>
                    <th className={styles.head}>SIZE</th>
                    <th className={styles.head}>TOTAL</th>
                </tr>
            </thead>
            <tbody>
                {renderOrderRow()}
            </tbody>
        </table>
    )
}