import mongoose from "mongoose";
import User from "../user/model";
import { Request, Response, NextFunction } from "express";

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

export { register };
