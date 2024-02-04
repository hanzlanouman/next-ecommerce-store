import OrderCard, { Order } from '@/app/components/OrderCard';
import startDb from '@/app/lib/db'
import OrderModel from '@/app/models/orderModel';
import { ObjectId } from 'mongoose';
import React from 'react'


const fetchOrders = async () => {
    await startDb();

    const orders = await OrderModel.find().sort('-createdAt').limit(5).populate<{
        userId: {
            _id: ObjectId, name: string, email: string,
            avatar?: { url: string }
        }
    }>({
        path: "userId",
        select: "name email avatar"
    })


    const result: Order[] = orders.map((order) => {

        return {
            id: order._id.toString(),
            customer: {
                id: order.userId._id.toString(),
                name: order.userId.name,
                email: order.userId.email,
                address: order.shippingDetails.address,
                avatar: order.userId.avatar?.url
            },
            subTotal: order.totalAmount,
            products: order.orderItems,
            deliveryStatus: order.deliveryStatus
        }
    }
    )

    return JSON.stringify(result);

}

const Orders = async () => {
    const results = await fetchOrders();
    const orders = JSON.parse(results);
    return (
        <div
            className='py-4 space-y-4'
        >
            {orders.map((order: Order) => {
                return (
                    <OrderCard key={order.id} order={order}
                        disableUpdate={false}
                    />
                )
            })}
        </div>
    )
}

export default Orders