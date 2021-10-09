import React, { useState } from 'react'
import { useWorker } from '../../hooks'
import { messages } from '../../interfaces'
import { BITCOIN_TICKER, ETHEREUM_TICKER } from '../../utils'
import { Loading, AskOrder, BidOrder } from '../'
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

    return (
        <section>
            <h4 className={styles.header}>
                Order Book
            </h4>
            <AskOrder
                data={orderBook?.asks}
                ticker={orderBook?.ticker}
                totalSize={orderBook?.totalSize}
            />

            <BidOrder
                data={orderBook?.bids}
                ticker={orderBook?.ticker}
                totalSize={orderBook?.totalSize}
            />
        </section>
    )
}