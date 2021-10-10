import React from 'react'
import { IOrderRow } from '../../interfaces'
import { getColorPercentage } from '../../utils'

export const RowOrder = ({ cumulativeTotalSize, price, size, color, totalSize }: IOrderRow) => {
    return (
        <>
            <td className="fill-bid" style={{ backgroundColor: color, backgroundSize: getColorPercentage(totalSize, cumulativeTotalSize) + "% 100%" }}>
                {cumulativeTotalSize}
            </td>
            <td>{cumulativeTotalSize}</td>
            <td>{size}</td>
            <td>{price}</td>
        </>
    )
}