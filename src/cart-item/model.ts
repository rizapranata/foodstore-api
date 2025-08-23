import mongoose, { Model, Schema, Document } from "mongoose";

export interface CartItemTypes extends Document {
  name: string;
  qty: number;
  price: number;
  image_url?: string;
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const cartItemSchema = new Schema<CartItemTypes>(
  {
    name: {
      type: String,
      minlength: [5, "Panjang nama makanan minimal 50 karakter"],
      required: [true, "name must be filled"],
    },
    qty: {
      type: Number,
      required: [true, "qty harus diisi"],
      min: [1, "minimal qty adalah 1"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    // ------- relation one-to-one with Product ----//
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    // ------- relation one-to-one with User ----//
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CartItem: Model<CartItemTypes> =
  mongoose.models.CartItem ||
  mongoose.model<CartItemTypes>("CartItem", cartItemSchema);
export default CartItem;
