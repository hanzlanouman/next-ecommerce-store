import React from 'react'
import NavUI from './NavUi'
import { auth } from '@/auth';
import CartModel from '@/app/models/cartModel';
import startDb from '@/app/lib/db';
import { Types } from 'mongoose';
import UserModel from '@/app/models/userModel';


const fetchUserProfile = async () => {
    const session = await auth();
    if (!session) return null;

    await startDb();
    const user = await UserModel.findById(session.user.id);
    if (!user) return null;
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar?.url,
        verified: user.verified,
    };
};

const getCartItemsCount = async () => {
    try {
        const session = await auth();

        if (!session?.user) return 0;

        await startDb();

        const userId = session.user.id;
        const cart = await CartModel.aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            { $unwind: "$items" },
            { $group: { _id: "$_id", totalQuantity: { $sum: "$items.quantity" } } }

        ])
        return cart.length > 0 ? cart[0].totalQuantity : 0;


    } catch (error) {
        console.log("Error getting cart", error)
        return 0;
    }

}

const Navbar = async () => {

    const count = await getCartItemsCount()

    const profile = await fetchUserProfile();
    return (
        <div>
            <NavUI cartItemsCount={count}
                avatar={profile?.avatar}
            />
        </div>
    )
}

export default Navbar