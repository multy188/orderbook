import { useState, useEffect, useRef } from 'react'
import { IUseWorker, ITransformedSocketData, messages } from '../interfaces'
import { strings } from '../utils';

export const useWorker = (): IUseWorker => {
    const [isLoading, setLoading] = useState(true);
    const [orderBook, setOrderBook] = useState<ITransformedSocketData>();

    // feedWorker is to be persisted for the lifetime of the component the useWorker is used, hence "useRef"
    const feedWorker = useRef<Worker>();

    useEffect(() => {
        feedWorker.current = new Worker(new URL('../webworkers/index.ts', import.meta.url));
        feedWorker.current.onmessage = (event: MessageEvent) => {

            // data recieved is either initial snapshot or subsequent delta
            if ((event.data.type === messages.INITIAL_SNAPSHOT) || event.data.type === messages.ORDER) {
                const transformedOrder: ITransformedSocketData = event.data.data;
                /** we could be receiving several data in a sec depending on throtle
                 *  settings so i am freezing data received before setting orderBook
                 */
                setOrderBook(Object.freeze(transformedOrder));
            } else if (event.data.type === messages.UNSUBSCRIBE) {
                console.log(strings.UNSUBSCRIBE);
            }
        }
        setLoading(false);
    }, [])

    return (feedWorker && feedWorker.current && isLoading)
        ? {
            isLoading,
            feedWorker: feedWorker.current,
            orderBook
        }
        : {
            isLoading,
            feedWorker: null,
            orderBook
        }

}