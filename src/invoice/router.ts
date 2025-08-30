import { Router } from "express";
import { show } from "./controller";

const router = Router();

router.get("/invoices/:order_id", show);

export default router;