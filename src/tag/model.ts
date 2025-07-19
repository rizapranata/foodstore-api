import mongoose from "mongoose";
const { model, Schema } = mongoose;

const tagSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama tag harus diisi"],
    minlength: [3, "Panjang nama tag minimal 3 karakter"],
    maxlength: [20, "Panjang nama tag max 20 karakter"],
  },
});

export default model("Tag", tagSchema);
