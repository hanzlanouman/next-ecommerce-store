import { getCartItems } from '@/app/lib/cartHelper';
import startDb from '@/app/lib/db';
import CartModel from '@/app/models/cartModel';
import OrderModel from '@/app/models/orderModel';
import ProductModel from '@/app/models/productModel';
import { CartProduct, StripeCustomer } from '@/app/types';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const POST = async (req: Request) => {
  const data = await req.text();

  const signature = req.headers.get('stripe-signature')!;
  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      data,
      signature,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      //create new order
      const stripeSession = event.data.object as {
        customer: string;
        payment_intent: string;
        amount_subtotal: number;
        customer_details: any;
        payment_status: string;
      };

      const customer = (await stripe.customers.retrieve(
        stripeSession.customer
      )) as unknown as StripeCustomer;
      //recount our stock

      const { cartId, userId, type, product } = customer.metadata;

      if (type === 'checkout') {
        const cartItems = await getCartItems(userId, cartId);
        if (!cartItems) {
          return NextResponse.json(
            { error: 'Cart not found' },
            { status: 404 }
          );
        }

        await OrderModel.create({
          userId,
          stripeCustomerId: stripeSession.customer,
          paymentIntent: stripeSession.payment_intent,
          totalAmount: stripeSession.amount_subtotal / 100,
          shippingDetails: {
            address: stripeSession.customer_details.address,
            email: stripeSession.customer_details.email,
            name: stripeSession.customer_details.name,
          },
          paymentStatus: stripeSession.payment_status,

          deliveryStatus: 'ordered',
          orderItems: cartItems.products,
        });
        const updateProductPromises = cartItems.products.map(
          async (product) => {
            await startDb();
            return await ProductModel.findByIdAndUpdate(product.id, {
              $inc: { quantity: -product.quantity },
            });
          }
        );
        await Promise.all(updateProductPromises);

        //delete cart
        await startDb();
        await CartModel.findByIdAndDelete(cartId);
      }

      if (type === 'instant-checkout') {
        if (!product)
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          );
        const productInfo = JSON.parse(product) as unknown as CartProduct;
        await OrderModel.create({
          userId,
          stripeCustomerId: stripeSession.customer,
          paymentIntent: stripeSession.payment_intent,
          totalAmount: stripeSession.amount_subtotal / 100,
          shippingDetails: {
            address: stripeSession.customer_details.address,
            email: stripeSession.customer_details.email,
            name: stripeSession.customer_details.name,
          },
          paymentStatus: stripeSession.payment_status,

          deliveryStatus: 'ordered',
          orderItems: [{ ...productInfo }],
        });

        await ProductModel.findByIdAndUpdate(productInfo.id, {
          $inc: { quantity: -1 },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error as any }, { status: 400 });
  }

  return NextResponse.json({ received: true });
};
