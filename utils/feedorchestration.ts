import { IRawSocketData, ITransformedSocketData, TRawOrder, IOrderStore, messages } from '../interfaces'
import { strings, convertArrayOrderToDictionary, convertDictionaryOrderToArray, sortOrderAndCalculateTotal, BITCOIN_TICKER, THROTLE_TIME } from '../utils'

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
            bids: {},
            asks: {},
            ticker: "",
            totalSize: 0
        };
        // this is a dummy dateto satisfy typescripts --strictPropertyInitialization. It will be overwritten when a snapshot or delta comes in
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

                // if price exist in store but new size is 0, delete from store
                else if (existingPriceInStore && size === 0) {
                    delete this.orderStore.asks[floorPrice]
                }

                // Price exist and size is not zero, update store
                else {
                    this.orderStore.asks[floorPrice] = {
                        price: floorPrice,
                        size,
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

                // if price exist in store but new size is 0, delete from store
                else if (existingPriceInStore && size === 0) {
                    delete this.orderStore.bids[floorPrice]
                }

                // Price exist and size is not zero, update store
                else {
                    this.orderStore.bids[floorPrice] = {
                        price: floorPrice,
                        size,
                        timeStamp: timeSubsequentOrderWasReceived
                    }
                }
            });
        }
        this.transformedOrderStore = this.transformRawOrder(convertDictionaryOrderToArray(this.orderStore.asks), convertDictionaryOrderToArray(this.orderStore.bids));

        // if it has been more than 3 seconds since we last posted a message, then post. This will help with throttling
        if (timeSubsequentOrderWasReceived > new Date(this.updatedDate.getTime() + THROTLE_TIME)) {
            // set new update time
            this.updatedDate = timeSubsequentOrderWasReceived;
            postMessage({ type: messages.ORDER, data: this.transformedOrderStore }, '*');
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
        },
            '*')
    }

    private transformRawOrder(asks: TRawOrder[], bids: TRawOrder[]) {
        const allBidsAndAsks = asks.concat(bids);

        //  calculate newOrderMaxSize 
        const newOrderMaxSize = allBidsAndAsks
            .filter((orders) => orders[1])
            .map((orders) => orders[1])
            .reduce((totalOrderSize: number, currentOrderSize) => totalOrderSize + currentOrderSize);

        const transformedData: ITransformedSocketData = {
            ticker: this.ticker,
            totalSize: newOrderMaxSize,
            asks: sortOrderAndCalculateTotal(convertArrayOrderToDictionary(asks, new Date())),
            bids: sortOrderAndCalculateTotal(convertArrayOrderToDictionary(bids, new Date()))
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
        this.feeds.send(JSON.stringify(subscriptionMessage));
        //update new ticker
        this.ticker = ticker;
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
            postMessage({ type: "CLOSE" }, '*');
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
            bids: {},
            asks: {},
            ticker: "",
            totalSize: 0
        };
    }

}