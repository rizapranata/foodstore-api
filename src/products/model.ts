import mongoose, { Model, Schema, Document } from "mongoose";

export interface ProductTypes extends Document {
  name: string;
  price: number;
  discount?: number;
  image_url: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
}

const productSchema = new Schema<ProductTypes>(
  {
    name: {
      type: String,
      minlength: [3, "Nama Produk terlalu pendek"],
      maxlength: [225, "Nama Produk terlalu panjang"],
      required: [true, "Nama Produk harus diisi"],
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
      required: [true, "Gambar produk harus diisi"],
    },
    // ------- relation one-to-one with Category ----//
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    // ------- relation one-to-many with Tag ----//
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product: Model<ProductTypes> =
  mongoose.models.Product ||
  mongoose.model<ProductTypes>("Product", productSchema);
export default Product;
