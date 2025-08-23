import { Router } from "express";
import multer from "multer";

import { store } from "./controller";

const router = Router();

router.post("/orders", multer().none(), store);

export default router;
