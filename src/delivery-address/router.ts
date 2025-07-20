import Router from "express";
import multer from "multer";
import { store, update, destroy, index } from "./controller";

const router = Router();

router.get("/delivery-address", index);
router.post("/delivery-address", multer().none(), store);
router.put("/delivery-address/:id", multer().none(), update);
router.delete("/delivery-address/:id", destroy);

export default router;
