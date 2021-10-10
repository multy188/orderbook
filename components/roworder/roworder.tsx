import React from 'react'
import { IOrderRow } from '../../interfaces'
import styles from './roworder.module.css'

export const RowOrder = ({ cumulativeTotalSize, price, size }: IOrderRow) => {
    return (
        <>
            <td className={`${styles.eachRowColumn}`} >{cumulativeTotalSize}</td>
            <td className={`${styles.eachRowColumn}`} >{size}</td>
            <td className={`${styles.eachRowColumn}`} >{price}</td>
        </>
    )
}