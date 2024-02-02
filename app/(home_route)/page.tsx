
import React, { FC } from 'react'
import startDb from '../lib/db'
import ProductModel from '../models/productModel'
import GridView from '../components/GridView'
import ProductCard from '../components/ProductCard'


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

const fetchLatestProducts = async () => {
  await startDb()
  const products = await ProductModel.find().sort('-createdAt').limit(15)

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

const Home: FC = async (

) => {

  const latestProducts = await fetchLatestProducts()
  const parsedProducts = JSON.parse(latestProducts) as LatestProduct[]
  return (
    <GridView>
      {
        parsedProducts.map((product) => {
          return (<ProductCard key={product.id} product={product} />)
        })
      }
    </GridView>
  )
}

export default Home