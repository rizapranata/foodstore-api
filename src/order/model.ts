import mongoose, { Schema, Model, Document } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import { ProductTypes } from "../types/product.types";

const AutoIncrement = AutoIncrementFactory(mongoose.connection as any);

export interface OrderTypes extends Document {
  total: number;
  status: "waiting_payment" | "processing" | "in_delivery" | "delivered";
  delivery_fee: number;
  delivery_address: {
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
    detail?: string;
  };
  user: mongoose.Types.ObjectId;
  order_items: mongoose.Types.ObjectId[];
}

const orderSchema = new Schema<OrderTypes>(
  {
    total: {
      type: Number,
      required: [true, "Total harus diisi"],
    },
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },

    delivery_fee: {
      type: Number,
      default: 0,
    },

    delivery_address: {
      provinsi: { type: String, required: [true, "provinsi harus diisi."] },
      kabupaten: { type: String, required: [true, "kabupaten harus diisi."] },
      kecamatan: { type: String, required: [true, "kecamatan harus diisi."] },
      kelurahan: { type: String, required: [true, "kelurahan harus diisi."] },
      detail: { type: String },
    },

    // relationships
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order_items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(AutoIncrement as any, { inc_field: "order_number" });
orderSchema.virtual("items_count").get(function (this: any) {
  return this.order_items.reduce(
    (total: number, item: ProductTypes) => total + (item.qty || 0),
    0
  );
});

const Order: Model<OrderTypes> =
  mongoose.models.Order || mongoose.model<OrderTypes>("Order", orderSchema);

export default Order;
