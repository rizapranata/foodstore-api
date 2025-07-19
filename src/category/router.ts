import Router from "express";
import multer from "multer";
import { store, update, destroy } from "./controller";

const router = Router();
router.post("/categories", multer().none(), store);
router.put("/categories/:id", multer().none(), update);
router.delete("/categories/:id", multer().none(), destroy);

export default router;
