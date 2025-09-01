import Router from "express";
import multer from "multer";
import { update, index } from "./controller";

const router = Router();
router.get("/carts", index);
router.put("/carts", multer().none(), update);
export default router;
