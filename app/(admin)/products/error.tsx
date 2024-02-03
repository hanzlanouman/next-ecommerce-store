'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div>
            <h2>Something went wrong!</h2>
            <h2>
                Cause: <span className='text-red-600'>{error.message}</span>
            </h2>
            <button
                className='
                    bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-md
                    mt-4
                    transition
                    duration-300
                    hover:bg-blue-700
                '
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }

            >
                Try again
            </button>
        </div>
    )
}