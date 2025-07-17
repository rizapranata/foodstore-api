import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../user/model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import { SECRET_KEY } from "../config";

export interface UserDocument extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  full_name: string;
}

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body;
    const user = new User(payload);
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      // handle email duplicate errors
      return res.status(409).json({
        error: 1,
        message: error.message,
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: 1,
        message: "Validation error",
        fields: error.errors,
      });
    }
    next(error);
  }
}

async function localStrategy(email: string, password: string, done: Function) {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart-items -token"
    );

    if (!user) {
      return done(null, false, { message: "User not found" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toObject();
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return done(error, false, { message: "Validation error" });
    }
    return done(error);
  }
  done();
}

async function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", async function (err: any, user: UserDocument) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const signed = jwt.sign(user, SECRET_KEY);
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );

    return res.status(200).json({
      message: "Login successful",
      data: { user, token: signed },
    });
  })(req, res, next);
}

export { register, localStrategy, login };
