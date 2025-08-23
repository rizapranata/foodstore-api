import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Definisikan interface untuk TypeScript
export interface DeliveryAddressDocument extends Document {
  name: string;
  village: string;
  province: string;
  regency: string;
  district: string;
  detail: string;
  user: mongoose.Types.ObjectId;
}

// 2. Definisikan schema
const deliveryAddressSchema = new Schema<DeliveryAddressDocument>(
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 3. Buat model dengan typing
const DeliveryAddress: Model<DeliveryAddressDocument> =
  mongoose.models.DeliveryAddress ||
  mongoose.model<DeliveryAddressDocument>(
    "DeliveryAddress",
    deliveryAddressSchema
  );

export default DeliveryAddress;
