import Router from "express";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from "./controller";

const router = Router();

router.get("/provinces", getProvinces);
router.get("/regencies", getRegencies);
router.get("/districts", getDistricts);
router.get("/villages", getVillages);

export default router;
