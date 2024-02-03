import UpdateProduct from '@/app/components/UpdateProduct'
import startDb from '@/app/lib/db'
import ProductModel from '@/app/models/productModel'
import { isValidObjectId } from 'mongoose'
import { redirect } from 'next/navigation'
import React from 'react'

import { ProdcutResponse } from '@/app/types'

interface Props {
    params: {
        productId: string
    }

}

const fetchProductInfo = async (productId: string): Promise<string> => {
    if (!isValidObjectId)  redirect('/404')

    await startDb();

    const product = await ProductModel.findById(productId)

    if (!product)  redirect('/404')


    const finalProduct: ProdcutResponse = {
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        bulletPoints: product.bulletPoints,
        images: product.images?.map(({ url, id }) => ({ url, id })),
        thumbnail: product.thumbnail,
        category: product.category,

    }

    return JSON.stringify(finalProduct)


}


const UpdatePage = async (props: Props) => {
    const { productId } = props.params;

    const product = await fetchProductInfo(productId)

    return (

        <UpdateProduct product={JSON.parse(product)} />
    )
}

export default UpdatePage