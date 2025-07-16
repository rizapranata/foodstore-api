import mongoose from "mongoose";
import Product from "./model";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { UPLOAD_DIR } from "../config";

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body;
    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
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
    const { limit = 10, skip = 0 } = req.query;
    const products = await Product.find()
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));
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
    const payload = req.body;
    const productId = req.params.id;

    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
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

        console.log("payload update", payload);

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
