import React from 'react'

export const Loading = ({ isLoading }: { isLoading: boolean }) => {
    return (
        isLoading
            ? <h4 className='center'>Loading...</h4>
            : null
    )

}