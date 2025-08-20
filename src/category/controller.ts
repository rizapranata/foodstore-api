import { Request, Response, NextFunction } from "express";
import Category from "./model";
import mongoose from "mongoose";
import { UserTypes } from "../types/user.types";
import { policyFor } from "../policy";

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("create", "Category")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to create a category",
      });
    }

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
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("update", "Category")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to update a category",
      });
    }

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
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("delete", "Category")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to delete a category",
      });
    }

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
