'use client'
import ProductForm from '@/app/components/ProductForm'
import { NewProductInfo } from '@/app/types'
import { newProductInfoSchema } from '@/app/utils/validationSchema'
import React from 'react'
import { toast } from 'react-toastify'
import { ValidationError } from 'yup'
const Create = () => {



    const handleCreateProduct = async (values: NewProductInfo) => {
        try {

            await newProductInfoSchema.validate(values, {
                abortEarly: false
            })
        } catch (error) {
            if (error instanceof ValidationError) {
                error.inner.forEach(err => {
                    toast.error(err.message)
                })
            }
        }
    }

    return (
        <div>
            <ProductForm onSubmit={
                handleCreateProduct
            } />
        </div>
    )
}

export default Create