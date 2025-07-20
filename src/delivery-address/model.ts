import mongoose from "mongoose";

const { model, Schema } = mongoose;
const deliveryAddressSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nama penerima harus diisi"],
      minlength: [3, "Nama penerima terlalu pendek"],
      maxlength: [225, "Nama penerima terlalu panjang"],
    },
    village: {
      type: String,
      required: [true, "Kelurahan harus diisi"],
      maxlength: [255, "Panjang maksimal kelurahan adalah 255 karakter"],
    },
    province: {
      type: String,
      required: [true, "Provinsi harus diisi"],
      maxlength: [255, "Panjang maksimal provinsi adalah 255 karakter"],
    },
    regency: {
      type: String,
      required: [true, "Kabupaten/Kota harus diisi"],
      maxlength: [255, "Panjang maksimal kabupaten adalah 255 karakter"],
    },
    district: {
      type: String,
      required: [true, "Kecamatan harus diisi"],
      maxlength: [255, "Panjang maksimal kecamatan adalah 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "Detail alamat harus diisi"],
      maxlength: [1000, "Detail alamat terlalu panjang"],
    },
    // ------- relation many-to-one with User ----//
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default model("DeliveryAddress", deliveryAddressSchema);
