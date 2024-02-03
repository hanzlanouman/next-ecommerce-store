
'use client'
import React from 'react'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify'

interface Props {
    id?: string;
    verified?: boolean;
}

const EmailVerificationBanner = (
    { id, verified }: Props
) => {

    const [submitting, setSubmitting] = React.useState(false)
    const applyForReverification = async () => {
        setSubmitting(true)
        if (!id) {
            return
        }

        const res = await fetch('/api/users/verify?userId=' + id,
            {
                method: 'GET'
            })

        const { message, error } = await res.json()

        if (!res.ok && error) {
            toast.error(error)
        }

        if (message) {
            toast.success(message)
        }
        setSubmitting(false)
    }
    if (verified) {
        return null
    }

    return (
        <div
            className='p-2 text-center bg-blue-50'
        ><span>It looks like you have not verified your email.</span>
            <button className={` ml-2 underline font-semibold ${submitting ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={applyForReverification}
                disabled={submitting}
            >{
                    submitting ? 'Sent. ✅' : 'Click here to request a verification email.'
                }</button>
        </div >
    )
}

export default EmailVerificationBanner