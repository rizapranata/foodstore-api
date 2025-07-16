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

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const payload = req.body;

    let category = await Category.findOneAndUpdate({ _id: id }, payload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
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

async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id });

    if (!category) {
      return res.status(404).json({
        error: 1,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
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

export { store, update, destroy };
