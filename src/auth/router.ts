import { Router } from "express";
import multer from "multer";
import passport from "passport";
import passportLocal from "passport-local";
import {
  register,
  login,
  me,
  logout,
  destroy,
  index,
  localStrategy,
  changePassword
} from "./constroller";

const LocalStrategy = passportLocal.Strategy;
const router = Router();

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));
router.post("/register", multer().none(), register);
router.post("/login", multer().none(), login);
router.get("/me", me);
router.post("/logout", logout);
router.get("/users", index);
router.delete("/delete/:id", multer().none(), destroy);
router.put("/change-password", multer().none(), changePassword);

export default router;
