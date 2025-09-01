import DeliveryAddress from "./model";
import { Request, Response, NextFunction } from "express";
import { policyFor } from "../policy";
import mongoose from "mongoose";
import { UserTypes } from "../types/user.types";

async function store(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("create", "DeliveryAddress")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to create a delivery address",
    });
  }

  try {
    const payload = req.body;
    const user = req.user as UserTypes;

    const address = new DeliveryAddress({
      ...payload,
      user: user._id
    });

    await address.save();
    return res.status(201).json({
      status: "success",
      data: address,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("update", "DeliveryAddress")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to update this delivery address",
    });
  }

  try {
    const { id } = req.params;
    const { _id, ...payload } = req.body;
    let address = await DeliveryAddress.findOne({ _id: id });

    address = await DeliveryAddress.findOneAndUpdate(
      { _id: id, user: (req.user as UserTypes)._id },
      { ...payload },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      data: address,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    next(error);
  }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("delete", "DeliveryAddress")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to delete this delivery address",
    });
  }

  try {
    const { id } = req.params;
    const address = await DeliveryAddress.findOneAndDelete({
      _id: id,
      user: (req.user as UserTypes)._id,
    });

    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Delivery address not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: address,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    next(error);
  }
}

async function index(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("read", "DeliveryAddress")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to view delivery addresses",
    });
  }

  try {
    const { limit = 10, skip = 0 } = req.query;
    const count = await DeliveryAddress.find({
      user: (req.user as UserTypes)._id,
    }).countDocuments();

    const deliveryAddress = await DeliveryAddress.find({
      user: (req.user as UserTypes)._id,
    })
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: deliveryAddress,
      count,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    next(error);
  }
}

export { store, update, destroy, index };
