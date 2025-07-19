import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Tag from "./model";
import { policyFor } from "../policy";
import UserTypes from "../utils/userTypes";

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("create", "Tag")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to create a tag",
      });
    }

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
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("update", "Tag")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to update a tag",
      });
    }

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
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("delete", "Tag")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to delete a tag",
      });
    }
    
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
