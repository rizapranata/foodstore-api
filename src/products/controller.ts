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
          image: filename,
        });
        await product.save();
        return res.json(product);
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
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    next(error);
  }

}

export { store, index };
