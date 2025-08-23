import mongoose, { Model, Schema, Document } from "mongoose";

export interface TagTypes extends Document {
  name: string;
}

const tagSchema = new Schema<TagTypes>({
  name: {
    type: String,
    required: [true, "Nama tag harus diisi"],
    minlength: [3, "Panjang nama tag minimal 3 karakter"],
    maxlength: [20, "Panjang nama tag max 20 karakter"],
  },
});

const Tag: Model<TagTypes> =
  mongoose.models.Tag || mongoose.model<TagTypes>("Tag", tagSchema);
export default Tag;
