import { useState, useEffect, useRef } from 'react'
import { IUseWorker, ITransformedSocketData, messages } from '../interfaces'

export const useWorker = (): IUseWorker => {
    const [isLoading, setLoading] = useState(true);
    const [orderBook, setOrderBook] = useState<ITransformedSocketData>();

    // this is to track if socket is subscribed
    const [isSocketSubscribed, setSocketSubscribed] = useState(true);

    // feedWorker is to be persisted for the lifetime of the component the useWorker is used, hence "useRef"
    const feedWorker = useRef<Worker>();

    useEffect(() => {
        feedWorker.current = new Worker(new URL('../webworkers/index.ts', import.meta.url));
        feedWorker.current.onmessage = (event: MessageEvent) => {
            switch (event.data.type) {
                case messages.INITIAL_SNAPSHOT:
                    /** we could be receiving several data in a sec depending on throtle
                     *  settings so i am freezing data received before setting orderBook
                    */
                    setOrderBook(Object.freeze(event.data.data));
                    break;
                case messages.ORDER:
                    /** we could be receiving several data in a sec depending on throtle
                     *  settings so i am freezing data received before setting orderBook
                    */
                    setOrderBook(Object.freeze(event.data.data));
                    break;
                case messages.UNSUBSCRIBED:
                    setSocketSubscribed(false)
                    break;
                case messages.SUBSCRIBED:
                    setSocketSubscribed(true)
                    break;
                default:
                    break;
            }
        }
        setLoading(false);
    }, [])

    return (feedWorker && feedWorker.current && !isLoading)
        ? {
            isLoading,
            feedWorker: feedWorker.current,
            orderBook,
            isSocketSubscribed
        }
        : {
            isLoading,
            feedWorker: null,
            orderBook,
            isSocketSubscribed
        }

}