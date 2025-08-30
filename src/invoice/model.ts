import mongoose, { Schema, Model, Document } from "mongoose";

export interface InvoiceTypes extends Document {
  sub_total: Number;
  delivery_fee: Number;
  delivery_address: {
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
    detail?: string;
  };
  total: Number;
  payment_status: "waiting_payment" | "paid" | "expired";
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
}

const invoiceSchema = new Schema<InvoiceTypes>(
  {
    sub_total: {
      type: Number,
      required: [true, "Sub total harus diisi"],
    },
    delivery_fee: {
      type: Number,
      required: [true, "Biaya pengiriman harus diisi"],
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "Provinsi harus diisi."] },
      kabupaten: { type: String, required: [true, "Kabupaten harus diisi."] },
      kecamatan: { type: String, required: [true, "Kecamatan harus diisi."] },
      kelurahan: { type: String, required: [true, "Kelurahan harus diisi."] },
      detail: { type: String },
    },
    total: {
      type: Number,
      required: [true, "Total harus diisi"],
    },
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid", "expired"],
      default: "waiting_payment",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const InvoiceModel: Model<InvoiceTypes> = mongoose.model<InvoiceTypes>(
  "Invoice",
  invoiceSchema
);
export default InvoiceModel;
