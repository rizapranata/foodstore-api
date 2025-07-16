import mongoose from "mongoose";
const { model, Schema } = mongoose;

const productSchema = new Schema(
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
    description: {
      type: String,
      maxlength: [1000, "Panjang deskripsi maksimal 1000 karakter"],
    },
    stok: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
      required: [true, "Gambar produk harus diisi"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    }
  },
  {
    timestamps: true,
  }
);

export default model("Product", productSchema);
