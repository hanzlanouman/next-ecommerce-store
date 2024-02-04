import ProductView from '@/app/components/ProductView'
import ReviewsList from '@/app/components/ReviewsList'
import startDb from '@/app/lib/db'
import ProductModel from '@/app/models/productModel'
import ReviewModel from '@/app/models/reviewModel'
import { isValidObjectId } from 'mongoose'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
    params: {
        product: string[]
    }
}

const fetchProduct = async (productId: string) => {



    if (!isValidObjectId(productId)) redirect('/404')

    await startDb()

    const product = await ProductModel.findById(productId)

    if (!product) {
        redirect('/404')

    }

    return JSON.stringify({
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail.url,
        rating: product.rating,
        images: product.images?.map(({ url }) => url),
        bulletPoints: product.bulletPoints,
        price: product.price,
        sale: product.sale
    })



}

const fetchProductReviews = async (productId: string) => {

    await startDb()

    const reviews = await ReviewModel.find({ product: productId }).populate<{
        userId: {
            name: string,
            avatar?: {
                url: string
            }
        }
    }>({
        path: 'userId',
        select: 'name avatar.url'
    })

    const result = reviews.map((r) => (
        {
            id: r._id.toString(),
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt,
            userInfo: {
                name: r.userId.name,
                avatar: r.userId.avatar?.url
            }
        }

    ))

    return JSON.stringify(result)


}

const Product = async ({ params }: Props) => {
    const { product } = params
    const productId = product[1]


    const productInfo = JSON.parse(await fetchProduct(productId))

    let productImages = [productInfo.thumbnail]

    if (productInfo.images) productImages = productImages.concat(productInfo.images)


    const reviews = JSON.parse(await fetchProductReviews(productId))
    return (
        <div
            className='p-4'
        >
            <ProductView
                title={productInfo.title}
                description={productInfo.description}
                price={productInfo.price}
                sale={productInfo.sale}
                points={productInfo.bulletPoints}
                images={productImages}
                rating={productInfo.rating}
            />
            <div
                className="py-4 space-y-5"
            >


                <div className="flex justify-between items-center 
                ">
                    <h1
                        className="text-2xl font-semi mb-2"
                    >
                        Reviews

                    </h1>
                    <Link
                        href={`/add-review/${productInfo.id}`}
                    >Add Review</Link>
                </div>
                <ReviewsList reviews={reviews} />
            </div>
        </div>
    )
}

export default Product