import { IRawSocketData, ITransformedSocketData, TRawOrder, IOrderStore, messages } from '../interfaces'
import { strings, convertArrayOrderToDictionary, convertDictionaryOrderToArray, BITCOIN_TICKER, THROTLE_TIME } from '../utils'

export class FeedOrchestration {
    private feeds: WebSocket;
    private ticker: string;
    private transformedOrderStore: ITransformedSocketData;
    private orderStore: IOrderStore;
    private updatedDate: Date;


    constructor(webSocketUrl = strings.WEBSOCKET_URL, ticker = BITCOIN_TICKER) {
        // initializing properties
        this.ticker = ticker;
        this.orderStore = {
            bids: {},
            asks: {},
            feed: "",
            product_id: "",
        };
        this.transformedOrderStore = {
            bids: [],
            asks: [],
            ticker: "",
            totalSize: 0
        };
        // this is a dummy date to satisfy typescripts --strictPropertyInitialization. It will be overwritten when a snapshot or delta comes in
        this.updatedDate = new Date();
        // create webSocket
        const socket = new WebSocket(webSocketUrl);

        socket.onopen = () => {
            const message = {
                event: 'subscribe',
                feed: 'book_ui_1',
                product_ids: [this.ticker]
            };
            this.feeds.send(JSON.stringify(message));
        }

        socket.onclose = () => {
            console.log(strings.SOCKET_CLOSED);
        }

        socket.onerror = (error: Event) => {
            console.log(strings.ERROR);
            // closing socket
            this.feeds.close();
            throw (error);
        }

        socket.onmessage = (event: MessageEvent) => {
            const socketData: IRawSocketData = JSON.parse(event.data);
            switch (socketData.feed) {
                // Snapshot represents the existing state of the order book
                case strings.CRYPTO_SNAPSHOT: {
                    this.processInitialSnapshot(socketData)
                    break
                }
                case strings.CRYPTO_DELTA: {
                    this.processSubsequentOrder(socketData)
                    break
                }
                default: {

                    break
                }
            }
        }
        this.feeds = socket;
    }

    // Processing subsequent delta messages after initial snapshot
    private processSubsequentOrder(socketData: IRawSocketData) {
        const timeSubsequentOrderWasReceived = new Date();
        const { asks, bids } = socketData;

        // if there were no bids or asks return
        if (!asks || !bids)
            return

        // loop through each asks and update order store
        if (asks) {
            asks.forEach((ask) => {
                const [price, size] = ask;
                const floorPrice = Math.floor(price);
                const existingPriceInStore = this.orderStore.asks[floorPrice];

                // if price doesn't exist in store but there is a size with the new order, add order to store
                if (!existingPriceInStore && size) {
                    this.orderStore.asks[floorPrice] = {
                        price: floorPrice,
                        size,
                        timeStamp: timeSubsequentOrderWasReceived
                    }
                }

                // if price exist in store and new order size is not 0, update store
                else if (existingPriceInStore && size !== 0) {
                    this.orderStore.asks[floorPrice] = {
                        price: floorPrice,
                        size: size + existingPriceInStore.size,
                        timeStamp: timeSubsequentOrderWasReceived
                    }
                }
            });
        }

        // loop through each bids and update order store
        if (bids) {
            bids.forEach((bid) => {
                const [price, size] = bid;
                const floorPrice = Math.floor(price);
                const existingPriceInStore = this.orderStore.bids[floorPrice];

                // if price doesn't exist in store but there is a size with the new order, add order to store
                if (!existingPriceInStore && size) {
                    this.orderStore.bids[floorPrice] = {
                        price: floorPrice,
                        size,
                        timeStamp: timeSubsequentOrderWasReceived
                    }
                }
                // if price exist in store and new bid order size is not 0, update store
                else if (existingPriceInStore && size !== 0) {
                    this.orderStore.bids[floorPrice] = {
                        price: floorPrice,
                        size: size + existingPriceInStore.size,
                        timeStamp: timeSubsequentOrderWasReceived
                    }
                }
            });
        }
        this.transformedOrderStore = this.transformRawOrder(convertDictionaryOrderToArray(this.orderStore.asks), convertDictionaryOrderToArray(this.orderStore.bids));

        // if it has been more than THROTLE_TIME since we last posted a message, then postMessage. This will help with throttling
        if (timeSubsequentOrderWasReceived > new Date(this.updatedDate.getTime() + THROTLE_TIME)) {
            // set new update time
            this.updatedDate = timeSubsequentOrderWasReceived;
            postMessage({ type: messages.ORDER, data: this.transformedOrderStore });
        }

    }

    // processing initial snapshot representing state of entire order book
    private processInitialSnapshot(socketData: IRawSocketData) {
        const { asks, bids } = socketData;

        // record the last update time
        this.updatedDate = new Date();

        this.orderStore = {
            ...socketData,
            asks: convertArrayOrderToDictionary(asks, this.updatedDate),
            bids: convertArrayOrderToDictionary(bids, this.updatedDate)
        }
        this.transformedOrderStore = this.transformRawOrder(asks, bids);
        postMessage({
            type: messages.INITIAL_SNAPSHOT,
            data: this.transformedOrderStore
        })
    }

    private transformRawOrder(asks: TRawOrder[], bids: TRawOrder[]) {
        // sorting orders
        let sortedAsks = asks.sort((a, b) => a[0] - b[0]).slice(0, 35);
        let sortedBids = bids.sort((a, b) => a[0] - b[0]).reverse().slice(0, 35);

        const allBidsAndAsks = sortedAsks.concat(sortedBids);

        //  calculate newOrderMaxSize 
        const newOrderMaxSize = allBidsAndAsks
            .filter((orders) => orders[1])
            .map((orders) => orders[1])
            .reduce((totalOrderSize: number, currentOrderSize) => totalOrderSize + currentOrderSize);

        const transformedData: ITransformedSocketData = {
            ticker: this.ticker,
            totalSize: newOrderMaxSize,
            asks: sortedAsks,
            bids: sortedBids
        }
        return transformedData;
    }

    toggleFeed(ticker: string) {
        // unsubscribe from socket
        const unsubscribeMessage = {
            event: "unsubscribe",
            feed: "book_ui_1",
            product_ids: [this.ticker],
        };

        this.feeds.send(JSON.stringify(unsubscribeMessage));
        this.eraseStores();

        // prepare new subscription message
        const subscriptionMessage = {
            event: "subscribe",
            feed: "book_ui_1",
            product_ids: [ticker],
        };
        //update new ticker
        this.ticker = ticker;
        this.feeds.send(JSON.stringify(subscriptionMessage));
    }

    subscribe() {
        console.log('subscribing');
        // prepare new subscription message
        const subscriptionMessage = {
            event: "subscribe",
            feed: "book_ui_1",
            product_ids: [this.ticker],
        };
        this.feeds.send(JSON.stringify(subscriptionMessage));
        postMessage({
            type: messages.SUBSCRIBED
        })
    }

    unSubscribe() {
        // prepare new subscription message
        const UnSubscriptionMessage = {
            event: "unsubscribe",
            feed: "book_ui_1",
            product_ids: [this.ticker],
        };
        this.feeds.send(JSON.stringify(UnSubscriptionMessage));
        postMessage({
            type: messages.UNSUBSCRIBED
        })
    }


    closeSocket() {
        try {
            const unsubscribeMessage = {
                event: "unsubscribe",
                feed: "book_ui_1",
                product_ids: [this.ticker],
            };
            this.feeds.send(JSON.stringify(unsubscribeMessage));
            // close socket
            this.feeds.close();
            postMessage({ type: "CLOSE" });
        } catch (e) {
            console.log(strings.ERROR);
            throw e;
        }
    }

    private eraseStores() {
        this.orderStore = {
            bids: {},
            asks: {},
            feed: "",
            product_id: "",
        };
        this.transformedOrderStore = {
            bids: [],
            asks: [],
            ticker: "",
            totalSize: 0
        };
    }

}