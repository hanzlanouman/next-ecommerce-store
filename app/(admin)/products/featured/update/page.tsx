import FeaturedProductForm from '@/app/components/FeaturedProductForm'
import startDb from '@/app/lib/db'
import FeaturedProductModel from '@/app/models/featuredProduct'
import { isValidObjectId } from 'mongoose'
import { redirect } from 'next/navigation'
import React from 'react'



interface Props {
    searchParams: { id: string }
}



const fetchFeaturedProduct = async (id: string) => {
    if (!isValidObjectId(id))  redirect('/404')


    try {


        await startDb();
        const product = await FeaturedProductModel.findById(id)


        if (!product)  redirect('/404')

        const { _id, title, link, linkTitle, banner } = product
        return {
            id: _id.toString(),
            title,
            link,
            linkTitle,
            banner: banner.url,
        }

    } catch (error) {
        console.log(error)
     redirect('/404')
    }


}

const UpdateFeaturedProduct = async ({ searchParams }: Props) => {
    const { id } = searchParams

    const product = await fetchFeaturedProduct(id)



    return (
        <FeaturedProductForm initialValue={product} />
    )
}

export default UpdateFeaturedProduct