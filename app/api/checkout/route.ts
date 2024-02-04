import { getCartItems } from '@/app/lib/cartHelper';
import { CartItems } from '@/app/types';
import { auth } from '@/auth';
import { isValidObjectId } from 'mongoose';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json(
        { error: 'Unauthorized Request' },
        { status: 401 }
      );
    const data = await req.json();
    const cartId = data.cartId as string;

    if (!isValidObjectId(cartId)) {
      console.log(cartId);
      return NextResponse.json({ error: 'Invalid Cart Id' }, { status: 400 });
    }

    //fetch cart details now
    const cartItems = await getCartItems(session.user.id, cartId);

    if (!cartItems) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const line_items = cartItems.products.map((product) => {
      return {
        price_data: {
          currency: 'pkr',
          unit_amount: product.price * 100,
          product_data: {
            name: product.title,
            images: [product.thumbnail],
          },
        },
        quantity: product.quantity,
      };
    });

    const customer = await stripe.customers.create({
      metadata: {
        userId: session.user.id,
        cartId: cartId,
        type: 'checkout',
      },
    });

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: process.env.PAYMENT_SUCCESS_URL!,
      cancel_url: process.env.NEXT_PUBLIC_BASE_URL!,
      shipping_address_collection: {
        allowed_countries: ['PK', 'US', 'CA', 'GB', 'AU'],
      },
      customer: customer.id,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
