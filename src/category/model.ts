import mongoose, { Model, Schema, Document } from "mongoose";

export interface CategoryTypes extends Document {
  name: string;
}

const categorySchema = new Schema<CategoryTypes>(
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

const Category: Model<CategoryTypes> =
  mongoose.models.Category ||
  mongoose.model<CategoryTypes>("Category", categorySchema);
export default Category;
