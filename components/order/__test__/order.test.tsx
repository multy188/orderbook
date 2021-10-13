import React from 'react'
// import { ReactDOM } from 'react-dom'
import { render, screen } from '@testing-library/react'
import { OrderBook } from '../order'
import { rawAskOrder, rawBidOrder } from '../../../__mocks__'
import { BITCOIN_TICKER } from '../../../utils'
import { useWorker } from '../../../hooks/useWorker'
import { useDetectBackground } from '../../../hooks/useDetectBackground'
import { ITransformedSocketData } from '../../../interfaces'

const mockUseWorker = useWorker as jest.Mock;

jest.mock("../../../hooks/useWorker", () => ({
    useWorker: () => (
        {
            feedWorker: null,
            isLoading: false,
            orderBook: { ticker: BITCOIN_TICKER, asks: rawAskOrder, bids: rawBidOrder, totalSize: 173 },
            isSocketSubscribed: true
        })
}));

jest.mock("../../../hooks/useDetectBackground", () => ({
    useDetectBackground: () => (false),
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe('OrderBook Component', () => {
    it('renders without crashing', () => {
        render(<OrderBook />)
    });
    // it('should display loading', () => {
    //     mockUseWorker.mockReturnValue({
    //         feedWorker: null,
    //         isLoading: true,
    //         orderBook: null,
    //         isSocketSubscribed: true
    //     })
    //     render(<OrderBook />)
    //     expect(screen.getByText('Loading...')).toBeDefined()
    // });

    it('should display Ticker', () => {
        render(<OrderBook />)
        expect(screen.getByText('Order Book | PI_XBTUSD')).toBeDefined()
    });

    it('should display Spread', () => {
        render(<OrderBook />)
        const spread = (rawAskOrder[0][0] - rawBidOrder[0][0]);
        expect(screen.getByTestId(`spread`).textContent).toBe('Spread ' + spread)
    });

    it('should display ToggleButton', () => {
        render(<OrderBook />)
        expect(screen.getByTestId(`toggle`)).toBeDefined()
    });


})