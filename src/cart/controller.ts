import mongoose from "mongoose";
import { policyFor } from "../policy";
import { Request, Response, NextFunction } from "express";
import { ProductTypes } from "../types/product.types";
import { UserTypes } from "../types/user.types";
import Product from "../products/model";
import CartItem from "../cart-item/model";

async function update(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("update", "Cart")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to update this cart",
    });
  }

  try {
    const { items } = req.body;
    const user = req.user as UserTypes;
    const productIds = items.map((item: ProductTypes) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });
    const cartItems = items.map((item: ProductTypes) => {
      const product = products.find((p) => p._id === item._id);
      if (!product) {
        return null;
      }
      return {
        _id: product._id,
        product_id: product._id,
        user_id: user._id,
        qty: item.qty,
        price: product.price,
        image_url: product.image_url,
        name: product.name,
      };
    });

    await CartItem.bulkWrite(
      cartItems.map((item: ProductTypes) => {
        return {
          updateOne: {
            filter: { user: user._id, product: item._id },
            update: item,
            upsert: true, // Create if it doesn't exist
          },
        };
      })
    );

    return res.status(200).json({
      status: "success",
      data: cartItems,
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
  if (!policy.can("read", "Cart")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to view this cart",
    });
  }

  try {
    const user = req.user as UserTypes;
    const cartItems = await CartItem.find({ user: user._id })
      .populate("product_id")
      .exec();

    return res.status(200).json({
      status: "success",
      data: cartItems,
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

export { update, index };
