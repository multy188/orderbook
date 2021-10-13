import React from 'react'
import { render, screen } from '@testing-library/react'
import { BidOrderTable } from '../bidOrderTable'
import { rawBidOrder } from '../../../__mocks__'


describe('BidOrderTable Component', () => {
    test('Should display Price ', async () => {
        render(<BidOrderTable color='red' orders={rawBidOrder} totalSize={1989146} />)
        expect(screen.getByTestId(rawBidOrder[0][0])).toBeDefined()
        expect(screen.getByTestId(rawBidOrder[1][0])).toBeDefined()
        expect(screen.getByTestId(rawBidOrder[2][0])).toBeDefined()
    })

    test('Should display Table Headers', async () => {
        render(<BidOrderTable color='red' orders={rawBidOrder} totalSize={1989146} />)
        expect(screen.getByText("PRICE")).toBeDefined()
        expect(screen.getByText("SIZE")).toBeDefined()
        expect(screen.getByText('TOTAL')).toBeDefined()
    })
})