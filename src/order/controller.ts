import mongoose, { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { UserTypes } from "../types/user.types";
import { policyFor } from "../policy";
import Order from "./model";
import OrderItem from "./model";
import CartItem from "../cart-item/model";
import DeliveryAddress from "../delivery-address/model";

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("create", "Order")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to create an order",
      });
    }
    const user = req.user as UserTypes;
    const { delivery_address, delivery_fee } = req.body;

    const items = await CartItem.find({
      user: user._id,
    }).populate("product");

    if (!items.length) {
      return res.status(422).json({
        error: 1,
        message: "Can not create order without items in cart",
      });
    }

    const address = await DeliveryAddress.findOne({ _id: delivery_address });
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      delivery_fee,
      delivery_address: {
        provinsi: address?.province,
        kabupaten: address?.regency,
        kecamatan: address?.district,
        kelurahan: address?.village,
        detail: address?.detail,
      },
    });

    const orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.name,
        qty: item.qty,
        price: item.price,
        order: order._id,
        product: item.product._id,
      }))
    );

    orderItems.forEach((item) => {
      order.order_items.push(item._id as Types.ObjectId);
    });

    await order.save();
    await CartItem.deleteMany({ user: user._id });
    return res.status(201).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(422).json({
        message: "Validation Error",
        errors: error.errors,
      });
    }
    next(error);
  }
}

async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("read", "Order")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to view orders",
      });
    }
    
    const { limit = 10, skip = 0 } = req.query;
    const user = req.user as UserTypes;
    const count = await Order.countDocuments({ user: user._id });
    const orders = await Order.find({ user: user._id })
      .populate("order_items")
      .populate("user")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: orders.map((order) => order.toJSON({ virtuals: true })), // karena schema Order memiliki field virtual yaitu items_count
      count,
    });
  } catch (error) {
    next(error);
  }
}

export { store, index };
