import React, {
  ReactNode
} from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Navbar from '@components/navbar'
interface Props {
  children: ReactNode

}

const GuestLayout = async ({ children }: Props) => {
  const session = await auth()
  if (session) {
    return redirect('/')
  }
  return (
    <div
      className='max-w-screen-xl mx-auto p-4 xl:p-0'
    >
      <Navbar />{children}</div>
  )
}

export default GuestLayout