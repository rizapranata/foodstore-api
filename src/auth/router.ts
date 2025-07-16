import Router from "express";
import multer from "multer";
import { register } from "./constroller";

const router = Router();
router.post("/register", multer().none(), register);

export default router;
