import Router from "express";
import os from "os";
import multer from "multer";
import { store, index, update, destroy } from "./controller";

const router = Router();
router.post("/products", multer({ dest: os.tmpdir() }).single("image"), store);
router.get("/products", index);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  update
);
router.delete("/products/:id", destroy);

export default router;
