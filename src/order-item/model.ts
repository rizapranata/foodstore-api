import mongoose, { Schema, model, Model, Document } from "mongoose";

export interface OrderItemTypes extends Document {
  name: string;
  price: number;
  qty: number;
  product: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
}

const orderItemSchema = new Schema<OrderItemTypes>(
  {
    name: {
      type: String,
      minlength: [5, "Panjang nama makanan minimal 50 karakter"],
      required: [true, "name must be filled"],
    },

    price: {
      type: Number,
      required: [true, "Harga item harus diisi"],
    },

    qty: {
      type: Number,
      required: [true, "Kuantitas harus diisi"],
      min: [1, "Kuantitas minimal 1"],
    },

    // relationships
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

const OrderItem: Model<OrderItemTypes> =
  mongoose.models.OrderItem ||
  model<OrderItemTypes>("OrderItem", orderItemSchema);
export default OrderItem;
