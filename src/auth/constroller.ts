import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../user/model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import { SECRET_KEY } from "../config";
import getToken from "../utils/getToken";
import { policyFor } from "../policy";
import { UserTypes } from "../types/user.types";

export interface UserDocument extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  full_name: string;
}

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body;
    const user = new User(payload);
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      // handle email duplicate errors
      return res.status(409).json({
        error: 1,
        message: error.message,
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: 1,
        message: "Validation error",
        fields: error.errors,
      });
    }
    next(error);
  }
}

async function localStrategy(email: string, password: string, done: Function) {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart-items -token"
    );

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: "Invalid password" });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    return done(null, userWithoutPassword);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return done(error, false, { message: "Validation error" });
    }
    return done(error);
  }
  done();
}

async function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", async function (err: any, user: UserDocument) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const signed = jwt.sign(user, SECRET_KEY);
    const resultUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { token: signed } },
      { new: true }
    );

    if (!resultUser) return;
    const role = resultUser?.role || "user";

    res.cookie("token", signed, {
      httpOnly: true,
      secure: false, // kalau masih lokal jangan pakai true
      sameSite: "lax", // atau "none" jika beda domain
      path: "/",
    });

    res.cookie("role", role, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      message: "Login successful",
      data: { user, token: signed },
    });
  })(req, res, next);
}

function me(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ error: 1, message: "Your're not login or token expired" });
  }
  return res.status(200).json({
    message: "User data retrieved successfully",
    data: user,
  });
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    const user = await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );

    if (!user || !token) {
      return res.status(401).json({
        error: 1,
        message: "Unauthorized",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("role", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}

async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("read", "User")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to read a User",
      });
    }

    let criteria = {};
    const { limit = 10, skip = 0, q = "" } = req.query;

    if (typeof q === "string" && q.length) {
      criteria = { ...criteria, full_name: { $regex: q, $options: "i" } };
    }

    const count = await User.countDocuments(criteria);
    const users = await User.find(criteria)
      .limit(Number(limit))
      .skip(Number(skip));

    res.status(200).json({
      status: "success",
      data: users,
      count,
    });
  } catch (error) {
    next(error);
  }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("delete", "User")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to delete this user!",
    });
  }

  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({
      _id: id,
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `User ${user.full_name} deleted!`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    next(error);
  }
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req.user as { _id: string })?._id;

    // 1. Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Current password and new password are required",
      });
    }

    // 2. Cari user berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // 3. Cek apakah current password valid
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // 4. Pastikan password baru berbeda dari lama
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        status: "error",
        message: "New password cannot be the same as the old password",
      });
    }

    // 5. hashing password dilakukan di model
    user.password = newPassword;
    await user.save();

    // 6. Respon sukses
    return res.status(200).json({
      status: "success",
      message: "Password changed successfully, please login again",
    });
  } catch (error) {
    // 7. Error handling rapi
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    next(error);
  }
}

export {
  register,
  localStrategy,
  login,
  me,
  logout,
  index,
  destroy,
  changePassword,
};
