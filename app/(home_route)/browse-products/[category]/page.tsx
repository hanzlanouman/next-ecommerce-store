
import React, { FC } from 'react'
import startDb from '@lib/db'
import ProductModel from '@models/productModel'
import GridView from '@components/GridView'
import ProductCard from '@components/ProductCard'

import HorizontalMenu from '@components/HorizontalMenu'


interface LatestProduct {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    price: {
        base: number;
        discounted: number;
    };
    category: string;
    quantity: number;
    sale: number;
}[]

const fetchProductsByCategory = async (category: string) => {
    await startDb()
    const products = await ProductModel.find({
        category
    }).sort('-createdAt')
    const productList = products.map((product) => {
        return {
            id: product._id.toString(),
            title: product.title,
            thumbnail: product.thumbnail.url,
            description: product.description,
            price: product.price,
            category: product.category,
            quantity: product.quantity,
            sale: product.sale
        }
    })


    return JSON.stringify(productList)
}


interface Props {
    params: {
        category: string
    }
}

const ProductByCategory = async (
    { params }: Props
) => {


    const products = await fetchProductsByCategory(decodeURIComponent(params.category))



    const parsedProducts = JSON.parse(products) as LatestProduct[]


    return (
        <div className='py-5 space-y-10'>
            < HorizontalMenu />
            {parsedProducts.length ?
                <GridView>
                    {parsedProducts.map((product) => {
                        return (<ProductCard key={product.id} product={product} />)
                    })
                    }
                </GridView> : <h1
                    className='text-center text-2xl font-semibold pt-12 opacity-50'
                >No products found in this category! </h1>
            }
        </div>
    )
}

export default ProductByCategory