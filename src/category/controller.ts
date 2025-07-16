import { Request, Response, NextFunction } from "express";
import Category from "./model";
import mongoose from "mongoose";

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body;
    const category = new Category(payload);
    await category.save();
    return res.status(201).json({
      status: "success",
      data: category,
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

export { store };
