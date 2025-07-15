import Router from "express";
import os from "os";
import multer from "multer";
import { store } from "./controller";

const router = Router();
router.post("/products", multer({ dest: os.tmpdir() }).single("image"), store);

export default router;
