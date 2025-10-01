import Router from "express";
import multer from "multer";
import { store, update, destroy, index } from "./controller";

const router = Router();
router.post("/categories", multer().none(), store);
router.put("/categories/:id", multer().none(), update);
router.delete("/categories/:id", multer().none(), destroy);
router.get("/categories", index);

export default router;
