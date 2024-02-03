import CartItems from '@/app/components/CartItems'
import startDb from '@/app/lib/db'
import CartModel from '@/app/models/cartModel'
import { auth } from '@/auth'
import { Types } from 'mongoose'
import React from 'react'

const fetchCartProducts = async () => {
    const session = await auth()

    if (!session?.user) {
        return null
    }

    await startDb();

    const [cartItems] = await CartModel.aggregate([
        {
            $match: {
                userId: new Types.ObjectId(session.user.id)
            }
        },
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "items.productId",
                as: "product"
            }
        },
        {
            $project: {
                _id: 0,
                id: { $toString: "$_id" },
                totalQty: { $sum: "$items.quantity" },
                products: {
                    id: { $toString: { $arrayElemAt: ["$product._id", 0] } },
                    title: { $arrayElemAt: ["$product.title", 0] },
                    thumbnail: { $arrayElemAt: ["$product.thumbnail.url", 0] },
                    price: { $arrayElemAt: ["$product.price.discounted", 0] },
                    quantity: "$items.quantity",
                    totalPrice: { $multiply: ["$items.quantity", { $arrayElemAt: ["$product.price.discounted", 0] }] }

                }
            }
        },
        {
            $group: {
                _id: null,
                id: { $first: "$id" },
                totalQuantity: { $sum: "$totalQty" },
                totalPrice: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
                products: { $push: "$products" }
            }
        }, {
            $project: {
                _id: 0,
                id: 1,
                totalQty: 1,
                totalPrice: 1,
                products: 1
            }
        }



    ])
    return cartItems

}


const Cart = async () => {


    const cart = await fetchCartProducts()

    if (!cart) {
        return (
            <div
                className=' w-full  rounded-lg py-10'
            >
                <h1
                    className="text-left text-2xl font-semibold mb-5"
                >Your Cart Details</h1>
                <hr
                    className="border-1 border-gray-300"
                />
                <h1
                    className="text-center text-2xl font-semibold
                        opacity-50 mt-10
                    "
                >No items in your cart!</h1>

            </div>
        )
    }
    return (<div
        className=' w-full  rounded-lg py-10'
    >
        <h1
            className="text-left text-2xl font-semibold mb-5"
        >Your Cart Details</h1>
        <hr
            className="border-1 border-gray-300"
        />
        <CartItems
            {...cart}
            cartTotal={cart.totalPrice}
        />
    </div>
    )
}

export default Cart