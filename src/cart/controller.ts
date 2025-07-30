import mongoose from "mongoose";
import { policyFor } from "../policy";
import { Request, Response, NextFunction } from "express";
import { ProductTypes } from "../types/product.types";
import { UserTypes } from "../types/user.types";
import Product from "../products/model";

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
      const product = products.find((p) => p._id.toString() === item._id);
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

export { update };
