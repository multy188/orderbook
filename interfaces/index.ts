export type TTransformedDictionaryOrder = { [key: number]: { price: number, size: number, total: number } }
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
    bids: TTransformedDictionaryOrder
    asks: TTransformedDictionaryOrder
    ticker: string
    totalSize: number
}

export interface ISocketPresentation {
    data: TTransformedDictionaryOrder
    ticker: string
    totalSize: number
}

export interface IUseWorker {
    isLoading: boolean,
    feedWorker: Worker | null,
    orderBook: ITransformedSocketData | undefined
}

export interface IOrderRow {
    size: number,
    price: number,
    cumulativeTotalSize: number,
    totalSize: number,
    color: string
}

export enum messages {
    "INITIAL_SNAPSHOT",
    "UNSUBSCRIBE",
    "ORDER",
    "CLOSE",
    "TOGGLE_FEED"
}