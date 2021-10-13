import React from 'react'
import { render, screen } from '@testing-library/react'
import { AskOrderTable } from '../askOrderTable'
import { rawAskOrder } from '../../../__mocks__'


describe('AskOrderTable Component', () => {
    test('Should display Price ', async () => {
        render(<AskOrderTable color='red' orders={rawAskOrder} totalSize={1989146} />)
        expect(screen.getByTestId(rawAskOrder[0][0])).toBeDefined()
        expect(screen.getByTestId(rawAskOrder[1][0])).toBeDefined()
        expect(screen.getByTestId(rawAskOrder[2][0])).toBeDefined()
    })

    test('Should display Table Headers', async () => {
        render(<AskOrderTable color='red' orders={rawAskOrder} totalSize={1989146} />)
        expect(screen.getByText("PRICE")).toBeDefined()
        expect(screen.getByText("SIZE")).toBeDefined()
        expect(screen.getByText('TOTAL')).toBeDefined()
    })
})