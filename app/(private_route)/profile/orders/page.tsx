import OrderListPublic, { Orders } from '@components/OrderListPublic';
import startDb from '@/app/lib/db'
import OrderModel from '@/app/models/orderModel';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'


const fetchOrders = async () => {
    const session = await auth();
    if (!session?.user) {
        return null;
    }

    await startDb();

    const orders = await OrderModel.find({
        userId: session.user.id
    })

    const result: Orders[] = orders.map((order) => {
        return {
            id: order._id.toString(),
            paymentStatus: order.paymentStatus,
            date: order.createdAt.toString(),
            total: order.totalAmount,
            deliveryStatus: order.deliveryStatus,
            products: order.orderItems

        }
    })

    return JSON.stringify(result);


}
const Order = async () => {
    const result = await fetchOrders();
    if (!result) {
        return redirect('/404');
    }
    return (
        <div>
            <OrderListPublic orders={JSON.parse(result)} />
        </div>
    )
}

export default Order