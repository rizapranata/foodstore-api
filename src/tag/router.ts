import Router from "express";
import multer from "multer";
import { store, update, destroy, index } from "./controller";

const router = Router();
router.post("/tags", multer().none(), store);
router.put("/tags/:id", multer().none(), update);
router.delete("/tags/:id", destroy);
router.get("/tags", index);

export default router;
