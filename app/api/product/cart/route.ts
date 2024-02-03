import startDb from '@/app/lib/db';
import CartModel from '@/app/models/cartModel';
import { NewCartRequest } from '@/app/types';
import { auth } from '@/auth';
import { isValidObjectId } from 'mongoose';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = (await req.json()) as NewCartRequest;

    if (!isValidObjectId(productId) || isNaN(quantity)) {
      return NextResponse.json({ message: 'Invalid Request' }, { status: 402 });
    }

    await startDb();

    const cart = await CartModel.findOne({ userId: user.id });

    //if no cart exists create a new one
    if (!cart) {
      await CartModel.create({
        userId: user.id,
        items: [{ productId, quantity }],
      });
      return NextResponse.json(
        {
          message: 'Item added to cart',
          success: true,
        },
        { status: 200 }
      );
    }

    //if cart exists, check if the product is already in the cart. Add the quantity if it is

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity + existingItem.quantity;
      if (existingItem.quantity < 1) {
        //if the quantity is less than 1, remove the item from the cart
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      cart.items.push({ productId: productId as any, quantity });
    }

    const cartUpdate = await cart.save();

    return NextResponse.json(
      {
        message: 'Item added to cart',
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
