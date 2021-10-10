import React, { useState } from 'react'
import { useWorker } from '../../hooks'
import { messages, TTransformedDictionaryOrder, ITransformedSocketData } from '../../interfaces'
import { BITCOIN_TICKER, ETHEREUM_TICKER, ASK_COLOR, BID_COLOR } from '../../utils'
import { Loading, RowOrder } from '../'
import styles from './order.module.css'

export const OrderBook = () => {
    const { feedWorker, isLoading, orderBook } = useWorker();
    // default ticker is Bitcoin
    const [ticker, setTicker] = useState(BITCOIN_TICKER)

    if (isLoading) {
        <Loading isLoading={isLoading} />
    }


    // this is to toggle between Ethereum and bitcoin using feedWorker from useWorker Hook
    const toggleFeed = () => {
        feedWorker?.postMessage({
            type: messages.TOGGLE_FEED,
            ticker: (orderBook?.ticker === BITCOIN_TICKER) ? ETHEREUM_TICKER : BITCOIN_TICKER
        })
    }

    const unSubscribe = () => {
        feedWorker?.postMessage({
            type: messages.CLOSE
        })
    }

    if (!orderBook) {
        return null
    }

    const renderOrderRow = (orders: TTransformedDictionaryOrder, totalSize: number, color: string) => {
        return Object.keys(orders)
            .map((key) => {
                const { total, price, size } = orders[parseFloat(key)];
                return (
                    <tr key={`${price}-${color}`} >
                        <RowOrder
                            totalSize={totalSize}
                            cumulativeTotalSize={total}
                            color={color}
                            price={price}
                            size={size}
                        />
                    </tr>
                )
            })
    }

    const renderTable = (orderBook: ITransformedSocketData, color: string) => {
        return (
            <table className={styles.orderBookTable}>
                <thead>
                    <tr className={styles.heading}>
                        <th className={styles.head}>TOTAL</th>
                        <th className={styles.head}>SIZE</th>
                        <th className={styles.head}>PRICE</th>
                    </tr>
                </thead>
                <tbody>
                    {renderOrderRow(orderBook.bids, orderBook.totalSize, color)}
                </tbody>
            </table>
        )
    }
    return (
        <section>
            <h4 className={styles.header}>
                Order Book
            </h4>
            <div className={styles.orderBook}>
                {renderTable(orderBook, BID_COLOR)}
                {renderTable(orderBook, ASK_COLOR)}
            </div>
        </section>
    )
}