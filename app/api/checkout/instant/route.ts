import { getCartItems } from '@/app/lib/cartHelper';
import ProductModel from '@/app/models/productModel';
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
    const productId = data.productId as string;

    if (!isValidObjectId(productId)) {
      console.log(productId, 'HEyYYY ');
      return NextResponse.json(
        { error: 'Invalid Product Id' },
        { status: 400 }
      );
    }

    //fetch Product details now
    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const line_items = {
      price_data: {
        currency: 'pkr',
        unit_amount: product.price.discounted * 100,
        product_data: {
          name: product.title,
          images: [product.thumbnail.url],
        },
      },
      quantity: 1,
    };

    const customer = await stripe.customers.create({
      metadata: {
        userId: session.user.id,
        product: JSON.stringify({
          id: product._id,
          title: product.title,
          thumbnail: product.thumbnail.url,
          totalPrice: product.price.discounted,
          price: product.price.discounted,
          quantity: 1,
        }),
        type: 'instant-checkout',
      },
    });

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [line_items],
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
