import { Router } from "express";

const router = Router();
import {
  store,
  update,
  destroy,
  resetPassword,
  index,
  statusUser,
} from "./controller";
import multer from "multer";

router.post("/users", multer().none(), store);
router.put("/users/:id", multer().none(), update);
router.delete("/users/:id", multer().none(), destroy);
router.put("/users/:id/reset-password", multer().none(), resetPassword);
router.get("/users", index);
router.put("/status/:id", multer().none(), statusUser);

export default router;
