import React from 'react'
import { ISocketPresentation } from '../../interfaces'

export const AskOrder = ({ data, ticker, totalSize }: ISocketPresentation) => {
    console.log('..susequent./', data)
    return (
        <div>Ask Order</div>
    )
}