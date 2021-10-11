import { useState, useEffect, useRef } from 'react'
import { IUseWorker, ITransformedSocketData, messages } from '../interfaces'
import { strings } from '../utils';

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
            // // data recieved is either initial snapshot or subsequent delta
            // if ((event.data.type === messages.INITIAL_SNAPSHOT) || event.data.type === messages.ORDER) {
            //     const transformedOrder: ITransformedSocketData = event.data.data;

            //     setOrderBook(Object.freeze(transformedOrder));

            //     !isSocketSubscribed && setSocketSubscribed(true)
            // } else if (event.data.type === messages.UNSUBSCRIBED) {
            //     // After socket unsubscribed, update isSocketSubscribe to false
            //     setSocketSubscribed(false)
            //     console.log(strings.UNSUBSCRIBE);
            // }
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