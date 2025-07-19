import mongoose from "mongoose";
const { model, Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nama kategori harus diisi"],
      minlength: [3, "Nama kategori terlalu pendek"],
      maxlength: [20, "Nama kategori terlalu panjang"],
    },
  },
  {
    timestamps: true,
  }
);

export default model("Category", categorySchema);
