import React, {
    ReactNode
} from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import EmailVerificationBanner from '../components/EmailVerificationBanner'
import Navbar from '@components/navbar'
interface Props {
    children: ReactNode

}

const PrivateLayout = async ({ children }: Props) => {
    const session = await auth()
    if (!session) {
        return redirect('/auth/signin')
    }




    return (
        <div

            className='max-w-screen-xl mx-auto p-4 xl:p-0'
        >
            <Navbar />
            <EmailVerificationBanner />
            {children}
        </div >
    )
}

export default PrivateLayout