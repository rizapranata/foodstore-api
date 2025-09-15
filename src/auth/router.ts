import { Router } from "express";
import multer from "multer";
import passport from "passport";
import passportLocal from "passport-local";
import { index, localStrategy } from "./constroller";
import { register, login, me, logout, statusUser } from "./constroller";

const LocalStrategy = passportLocal.Strategy;
const router = Router();

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));
router.post("/register", multer().none(), register);
router.post("/login", multer().none(), login);
router.get("/me", me);
router.post("/logout", logout);
router.get("/users", index);
router.put("/status/:id", multer().none(), statusUser);

export default router;
