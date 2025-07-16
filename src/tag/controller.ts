import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Tag from "./model";

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body;
    const tag = new Tag(payload);
    await tag.save();
    return res.status(201).json({
      status: "success",
      data: tag,
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

    let tag = await Tag.findOneAndUpdate({ _id: id }, payload, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return res.status(404).json({
        status: "fail",
        message: "Tag not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: tag,
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
    let tag = await Tag.findOneAndDelete({ _id: id });

    if (!tag) {
      return res.status(404).json({
        status: "fail",
        message: "Tag not found",
      });
    }

    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export { store, update, destroy };
