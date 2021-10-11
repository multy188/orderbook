import { FeedOrchestration } from '../utils'
import { messages } from '../interfaces'
const feedOrchestration = new FeedOrchestration();

onmessage = (event: MessageEvent) => {
    switch (event.data.type) {
        case messages.CLOSE: {
            feedOrchestration.closeSocket();
            break
        }
        case messages.TOGGLE_FEED: {
            feedOrchestration.toggleFeed(event.data.ticker);
            break
        }
        case messages.SUBSCRIBE: {
            feedOrchestration.subscribe();
            break
        }
        case messages.UNSUBSCRIBE: {
            feedOrchestration.unSubscribe();
            break
        }
        default:
            break;
    }
}