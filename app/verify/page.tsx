"use client"
import { notFound, redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

interface Props {
    searchParams: {
        token: string
        , userId: string
    }
}

interface ApiResponse {
    message: string;
    error: string;
}
const Verify = (
    props: Props
) => {

    const router = useRouter();

    const { token, userId } = props.searchParams;

    useEffect(
        () => {
            fetch('/api/users/verify',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        token, userId
                    })
                }).then(async res => {
                    const apiRes = await res.json()

                    const { error, message } = apiRes as ApiResponse

                    if (res.ok) {
                        toast.success(message)
                        router.replace('/')
                    }

                    if (!res.ok && error) toast.error(error)
                })
        }
    )

    if (!token || !userId) return notFound()
    return (
        <div className='text-3xl opacity-80 text-center p-5 animate-pulse'>
            Please wait...

            <p>while we verify your account</p>
        </div>
    )
}

export default Verify