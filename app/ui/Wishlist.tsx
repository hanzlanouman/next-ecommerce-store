import React from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface Props {
    isActive?: boolean;

}

const Wishlist = ({ isActive }: Props) => {
    return (

        isActive ? <HeartIconSolid className="h-6 w-6 text-red-400" /> : <HeartIcon className="h-6 w-6" />

    )
}

export default Wishlist