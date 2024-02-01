import React, {
    ReactNode
} from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import EmailVerificationBanner from '../components/EmailVerificationBanner'
import AdminSidebar from '../components/AdminSidebar'
interface Props {
    children: ReactNode

}

const AdminLayout = async ({ children }: Props) => {
    const session = await auth()
    const user = session?.user

    const isAdmin = user?.role === 'admin'
    if (!session) {
        return redirect('/auth/signin')
    }
    if (!isAdmin) {
        return redirect('/auth/signin')
    }




    return (

        <AdminSidebar>
            {children}
        </AdminSidebar>
    )
}

export default AdminLayout