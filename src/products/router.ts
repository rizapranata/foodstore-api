import Router from "express";
import os from "os";
import multer from "multer";
import { store, index } from "./controller";

const router = Router();
router.post("/products", multer({ dest: os.tmpdir() }).single("image"), store);
router.get("/products", index);

export default router;
