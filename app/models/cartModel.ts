import { Document, Model, ObjectId, Schema, model, models } from 'mongoose';

interface CartItem {
  productId: ObjectId;
  quantity: number;
}

interface CartDocument extends Document {
  userId: ObjectId;
  items: CartItem[];
}

const cartSchema = new Schema<CartDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = models.Cart || model<CartDocument>('Cart', cartSchema);

export default CartModel as Model<CartDocument>;
