export type TRawOrder = [price: number, size: number]
export type TDictionaryOrder = { [key: number]: { price: number, size: number, timeStamp: Date } }

export interface IRawSocketData {
    bids: TRawOrder[]
    asks: TRawOrder[]
    feed: string
    product_id: string
}

export interface IOrderStore {
    bids: TDictionaryOrder
    asks: TDictionaryOrder
    feed: string
    product_id: string
}

export interface ITransformedSocketData {
    bids: TRawOrder[]
    asks: TRawOrder[]
    ticker: string
    totalSize: number
}

export interface IUseWorker {
    isLoading: boolean,
    feedWorker: Worker | null,
    orderBook: ITransformedSocketData | undefined,
    isSocketSubscribed: boolean
}

export interface IOrderRow {
    size: number,
    price: number,
    cumulativeTotalSize: number
}

export enum messages {
    "INITIAL_SNAPSHOT",
    "UNSUBSCRIBE",
    "UNSUBSCRIBED",
    "ORDER",
    "CLOSE",
    "TOGGLE_FEED",
    "SUBSCRIBE",
    "SUBSCRIBED",
}