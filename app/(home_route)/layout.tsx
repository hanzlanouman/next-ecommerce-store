import React, {
    ReactNode
} from 'react'
import Navbar from '@components/navbar'
interface Props {
    children: ReactNode

}

const HomeLayout = async ({ children }: Props) => {

    return (
        <div
            className='max-w-screen-xl mx-auto p-4 xl:p-0'
        >
            <Navbar />{children}
        </div>
    )
}

export default HomeLayout