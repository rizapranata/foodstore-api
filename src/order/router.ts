import { Router } from "express";
import multer from "multer";

import { store, index } from "./controller";

const router = Router();

router.post("/orders", multer().none(), store);
router.get("/orders", index);

export default router;
