import FeaturedProductForm from '@/app/components/FeaturedProductForm'
import FeaturedProductTable from '@/app/components/FeaturedProductTable'
import startDb from '@/app/lib/db'
import FeaturedProductModel from '@/app/models/featuredProduct'
import React from 'react'



const fetchFeaturedProducts = async () => {

    try {
        await startDb();

        const featuredProducts = await FeaturedProductModel.find()

        return featuredProducts.map((product) => {
            return {
                id: product._id.toString(),
                title: product.title,
                link: product.link,
                linkTitle: product.linkTitle,
                banner: product.banner.url,
            }
        })

    } catch (error) {
        console.log(error)
        return []
    }
}

const AddFeaturedProduct = async () => {

    const featuredProducts = await fetchFeaturedProducts()
    return (
        <div><FeaturedProductForm />
            <FeaturedProductTable
                products={featuredProducts!}
            />
        </div>
    )
}

export default AddFeaturedProduct