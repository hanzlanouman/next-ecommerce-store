import startDb from '@/app/lib/db'
import ProductModel from '@/app/models/productModel'
import { isValidObjectId } from 'mongoose'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
    params: {
        product: string[]
    }
}

const fetchProduct = async (productId: string) => {

    try {

        if (!isValidObjectId(productId)) return redirect('/404')

        await startDb()

        const product = await ProductModel.findById(productId)

        if (!product) return redirect('/404')

        return JSON.stringify({
            id: product._id.toString(),
            title: product.title,
            description: product.description,
            thumbnail: product.thumbnail.url,
            images: product.images?.map(({ url }) => url),
            bulletPoints: product.bulletPoints,
            price: product.price,
        })

    } catch (error) {
        console.error(error)
        return redirect('/404')
    }

}

const Product = async ({ params }: Props) => {
    const { product } = params
    const productId = product[1]

    fetchProduct(productId)

    const productInfo = (await fetchProduct(productId))
    return (
        <div>{
            productInfo
        }</div>
    )
}

export default Product