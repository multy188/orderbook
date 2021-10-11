import React from 'react'
import { useWorker, useDetectBackround } from '../../hooks'
import { messages } from '../../interfaces'
import { BITCOIN_TICKER, ETHEREUM_TICKER, ASK_COLOR, BID_COLOR } from '../../utils'
import { Loading, AskOrderTable, BidOrderTable } from '../'
import styles from './order.module.css'

export const OrderBook = () => {
    const { feedWorker, isLoading, orderBook, isSocketSubscribed } = useWorker();
    const isHidden = useDetectBackround();

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

    const subscribe = () => {
        feedWorker?.postMessage({
            type: messages.SUBSCRIBE
        })
    }

    // Tab switched so unsubscribe
    if (isHidden && isSocketSubscribed) {
        feedWorker?.postMessage({
            type: messages.UNSUBSCRIBE
        })
    }

    if (!orderBook) {
        return null
    }

    return (
        <section>
            <div className={styles.header}>
                <p className='flex_1'>Order Book | {orderBook.ticker}</p>
                <p className={styles.spread}>Spread {orderBook.asks[0][0] - orderBook.bids[0][0]}</p>
            </div>
            <div className={styles.orderBook}>
                <BidOrderTable totalSize={orderBook.totalSize} orders={orderBook.bids} color={BID_COLOR} />
                <AskOrderTable totalSize={orderBook.totalSize} orders={orderBook.asks} color={ASK_COLOR} />
            </div>
            <div className={styles.toggle}>
                {(isSocketSubscribed)
                    ? <button className={styles.toggleButton} onClick={toggleFeed}>Toggle Feed</button>
                    : < p > Feed was disconnected when Tab was switched. This is to reduce data usage. Click <button className={styles.connectButton} onClick={subscribe} >Here</button> to reconnect. </p>

                }
            </div>
        </section>
    )
}