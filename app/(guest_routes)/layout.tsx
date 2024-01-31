import React, {
  ReactNode
} from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
interface Props {
  children: ReactNode

}

const GuestLayout = async ({ children }: Props) => {
  const session = await auth()
  console.log(session)
  if (session) {
    return redirect('/')
  }
  return (
    <div>{children}</div>
  )
}

export default GuestLayout