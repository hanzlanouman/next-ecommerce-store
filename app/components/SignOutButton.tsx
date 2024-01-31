import { signOut } from 'next-auth/react'
import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode
}
const SignOutButton = (
    { children }: Props
) => {
    return (
        <div
            onClick={async () => await signOut({ redirect: false, callbackUrl: '/' })}
        >{children}</div>
    )
}

export default SignOutButton