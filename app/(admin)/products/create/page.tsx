'use client'
import ProductForm from '@/app/components/ProductForm'
import { NewProductInfo } from '@/app/types'
import { uploadImage } from '@/app/utils/helper'
import { newProductInfoSchema } from '@/app/utils/validationSchema'
import React from 'react'
import { toast } from 'react-toastify'
import { ValidationError } from 'yup'
import { createProduct } from '../action'
const Create = () => {



    const handleCreateProduct = async (values: NewProductInfo) => {
        try {
            const { thumbnail, images } = values

            await newProductInfoSchema.validate(values, {
                abortEarly: false
            })

            const thumbnailRes = await uploadImage(thumbnail!)

            let productImages: { id: string, url: string }[] = []
            if (images) {
                const uploadPromise = images.map(async (imageFile) => {
                    const { id, url } = await uploadImage(imageFile)
                    return { id, url }
                })
                productImages = await Promise.all(uploadPromise)
            }

            await createProduct({

                ...values,
                price: {
                    base: values.mrp,
                    discounted: values.salePrice,
                },
                thumbnail: thumbnailRes,
                images: productImages

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