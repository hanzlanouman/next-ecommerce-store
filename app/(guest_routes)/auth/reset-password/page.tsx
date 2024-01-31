import startDb from '@lib/db'
import PasswordResetTokenModel from '@models/passwordResetTokenModel'
import { notFound } from 'next/navigation'
import React from 'react'
import UpdatePassword from '@/app/components/UpdatePassword'


interface Props {
    searchParams: {
        token: string
        , userId: string
    }
}


const fetchTokenValidation = async (token: string, userId: string) => {

    startDb()
    const resetToken = await PasswordResetTokenModel.findOne({
        user: userId
    })
    if (!resetToken) return (null)

    const isMatched = await resetToken.compareToken(token);

    if (!isMatched) return (null)

    return true
}

const ResetPassword = async ({ searchParams }: Props) => {
    const { token, userId } = searchParams

    if (!token || !userId) return (notFound())

    const isValid = await fetchTokenValidation(token, userId)

    if (!isValid) return (notFound())
    return (
        <UpdatePassword
            token={token}
            userId={userId}
        />
    )
}

export default ResetPassword