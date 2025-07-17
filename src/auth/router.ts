import Router from "express";
import multer from "multer";
import passport from "passport";
import passportLocal from "passport-local";
import { localStrategy } from "./constroller";
import { register, login } from "./constroller";

const LocalStrategy = passportLocal.Strategy;
const router = Router();

router.post("/register", multer().none(), register);
passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));
router.post("/login", multer().none(), login);

export default router;
