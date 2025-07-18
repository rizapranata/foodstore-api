import mongoose from "mongoose";
import Product from "./model";
import Tag from "../tag/model";
import Category from "../category/model";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { UPLOAD_DIR } from "../config";
import { policyFor } from "../policy";
import UserTypes from "../utils/userTypes";

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("User Role:", req.user);

    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("create", "Product")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to create a product",
      });
    }

    let payload = req.body;
    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category; // Remove category if not found
      }
    }

    if (typeof payload.tags === "string") {
      payload.tags = [payload.tags]; // convert single tag jadi array
    }

    if (payload.tags.length > 0) {
      const tags = await Tag.find({
        name: { $in: payload.tags.map((tag: string) => tag.trim()) },
      });

      if (tags.length) {
        payload.tags = tags.map((tag) => tag._id);
      } else {
        payload.tags = []; // bersihkan jika tidak ditemukan
      }
    }

    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];

      const allowedExt = ["jpg", "jpeg", "png", "gif"];
      if (!allowedExt.includes(originalExt)) {
        return res.status(400).json({
          error: 1,
          message: "Invalid image format",
          allowed: allowedExt,
        });
      }

      const filename = req.file.filename + "." + originalExt;
      const targetPath = path.resolve(UPLOAD_DIR, filename);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);
      src.on("end", async () => {
        const product = new Product({
          ...payload,
          image_url: filename,
        });
        await product.save();
        return res.status(201).json({
          status: "success",
          message: "Product created successfully",
          data: product,
        });
      });

      src.on("error", (err) => {
        fs.unlinkSync(tmp_path);
        return res.status(500).json({
          error: 1,
          message: "Failed to upload image",
          details: err.message,
        });
      });
    } else {
      const product = new Product(payload);
      await product.save();
      res.status(201).json({
        status: "success",
        message: "Product created successfully",
        data: product,
      });
    }
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

async function index(req: Request, res: Response, next: NextFunction) {
  try {
    let criteria = {};
    let { limit = 10, skip = 0, q = "", category = "", tags = [] } = req.query;

    if (typeof q === "string" && q.length) {
      criteria = { ...criteria, name: { $regex: q, $options: "i" } };
    }

    if (typeof category === "string" && category.length) {
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (categoryDoc) {
        criteria = { ...criteria, category: categoryDoc._id };
      }
    }

    if (Array.isArray(tags) && tags.length > 0) {
      const tagDocs = await Tag.find({
        name: { $in: tags },
      });
      if (tagDocs.length) {
        criteria = {
          ...criteria,
          tags: { $in: tagDocs.map((tag) => tag._id) },
        };
      }
    }

    const products = await Product.find(criteria)
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string))
      .populate("category", "name")
      .populate("tags", "name");

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("update", "Product")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to update a product",
      });
    }

    let payload = req.body;
    const productId = req.params.id;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category; // Remove category if not found
      }
    }

    if (typeof payload.tags === "string") {
      payload.tags = [payload.tags]; // convert single tag jadi array
    }

    if (payload.tags?.length > 0) {
      const tags = await Tag.find({
        name: { $in: payload.tags.map((tag: string) => tag.trim()) },
      });

      if (tags?.length) {
        payload.tags = tags.map((tag) => tag._id);
      } else {
        payload.tags = []; // bersihkan jika tidak ditemukan
      }
    }

    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];

      const allowedExt = ["jpg", "jpeg", "png", "gif"];
      if (!allowedExt.includes(originalExt)) {
        return res.status(400).json({
          error: 1,
          message: "Invalid image format",
          allowed: allowedExt,
        });
      }

      const filename = req.file.filename + "." + originalExt;
      const targetPath = path.resolve(UPLOAD_DIR, filename);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);
      src.on("end", async () => {
        let product = await Product.findOne({ _id: productId });
        const currentImage = `${UPLOAD_DIR}${product?.image_url}`;
        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }

        product = await Product.findOneAndUpdate(
          { _id: productId },
          {
            ...payload,
            image_url: filename,
          },
          { new: true, runValidators: true }
        );

        return res.status(200).json({
          status: "success",
          data: product,
        });
      });

      src.on("error", (err) => {
        fs.unlinkSync(tmp_path);
        return res.status(500).json({
          error: 1,
          message: "Failed to upload image",
          details: err.message,
        });
      });
    } else {
      let product = await Product.findOneAndUpdate(
        { _id: productId },
        payload,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: product,
      });
    }
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
    if (!policy.can("delete", "Product")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to delete a product",
      });
    }

    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    const currentImage = `${UPLOAD_DIR}${product?.image_url}`;

    if (!product) {
      return res.status(404).json({
        error: 1,
        message: "Product not found",
      });
    }

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export { store, index, update, destroy };
