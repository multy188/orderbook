export type TTransformedDictionaryOrder = { [key: number]: [price: number, size: number, total: number] }
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

export enum messages {
    "INITIAL_SNAPSHOT",
    "UNSUBSCRIBE",
    "ORDER",
    "CLOSE",
    "TOGGLE_FEED"
}