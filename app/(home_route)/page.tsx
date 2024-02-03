
import React, { FC } from 'react'
import startDb from '@lib/db'
import ProductModel from '@models/productModel'
import GridView from '@components/GridView'
import ProductCard from '@components/ProductCard'
import FeaturedProductsSlider from '@components/FeaturedProductsSlider'
import FeaturedProductModel from '../models/featuredProduct'
import HorizontalMenu from '../components/HorizontalMenu'


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

const fetchFeaturedProducts = async () => {
  await startDb()

  const products = await FeaturedProductModel.find().sort('-createdAt')

  const productList = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      banner: product.banner.url,
      link: product.link,
      linkTitle: product.linkTitle
    }
  })

  return JSON.stringify(productList)
}


const Home: FC = async (

) => {

  const latestProducts = await fetchLatestProducts()

  const featuredProducts = JSON.parse(await fetchFeaturedProducts())

  const parsedProducts = JSON.parse(latestProducts) as LatestProduct[]


  return (
    <div
      className='py-5 space-y-10'
    >
      <FeaturedProductsSlider
        products={featuredProducts}
      />
      <HorizontalMenu />
      <GridView>
        {
          parsedProducts.map((product) => {
            return (<ProductCard key={product.id} product={product} />)
          })
        }
      </GridView>
    </div>
  )
}

export default Home