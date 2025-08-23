import mongoose, { Model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserTypes extends Document {
  full_name: string;
  customer_id: number;
  email: string;
  password: string;
  role: string;
  token: string[];
}

export interface counterTypes extends Document {
  _id: string; // This will be the identifier for the counter
  seq: number; // This will hold the sequence number
}

const counterSchema = new Schema<counterTypes>({
  _id: String,
  seq: { type: Number, default: 0 },
});

const CounterCustomerId =
  mongoose.models.CounterCustomerId ||
  mongoose.model<counterTypes>("CounterCustomerId", counterSchema);

const userSchema = new Schema<UserTypes>(
  {
    full_name: {
      type: String,
      required: [true, "Nama harus diisi"],
      maxlength: [255, "Panjang nama harus antara 3 - 255 karakter"],
      minlength: [3, "Panjang nama harus antara 3 - 255 karakter"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      maxlength: [255, "Panjang email maksimal 255 karakter"],
      unique: [true, "Email sudah terdaftar"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: "Email tidak valid",
      },
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      maxlength: [255, "Panjang password maksimal 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await CounterCustomerId.findByIdAndUpdate(
        "customer_id",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.customer_id = counter.seq;
      next();
    } catch (err) {
      next(err as Error);
    }
  } else {
    next();
  }
});

const User: Model<UserTypes> =
  mongoose.models.User || mongoose.model<UserTypes>("User", userSchema);
export default User;
