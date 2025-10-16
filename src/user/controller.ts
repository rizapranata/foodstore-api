import { Request, Response, NextFunction } from "express";
import { policyFor } from "../policy";
import { UserTypes } from "../types/user.types";
import mongoose from "mongoose";
import User from "./model";
import bcrypt from "bcrypt";

async function store(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("create", "User")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to create a User",
    });
  }

  try {
    const payload: UserTypes = req.body;
    const user = new User(payload);
    await user.save();
    res.status(201).json({
      message: "Success create new user",
      data: user,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: 1,
        message: "Please complete your form",
        details: error.errors,
      });
    }

    next(error);
  }
}

async function index(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("read", "User")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to read Users",
    });
  }

  try {
    let criteria = {};
    let { limit = 10, skip = 0, q = "" } = req.query;

    if (typeof q === "string" && q.length) {
      criteria = {
        ...criteria,
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      };
    }
    const count = await User.countDocuments(criteria);
    const users = await User.find(criteria)
      .limit(Number(limit))
      .skip(Number(skip));

    res.status(200).json({
      status: "Success get all users",
      data: users,
      count,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: 1,
        message: "Validation Error",
        details: error.errors,
      });
    }

    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("update", "User")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to update a User",
    });
  }

  try {
    const { id } = req.params;
    const payload: UserTypes = req.body;

    if (payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!user) {
      return res.status(404).json({
        error: 1,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success update user",
      data: user,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: 1,
        message: "Validation Error",
        details: error.errors,
      });
    }

    next(error);
  }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("delete", "User")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to delete a User",
    });
  }

  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        error: 1,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success delete user",
      data: user,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: 1,
        message: "Validation Error",
        details: error.errors,
      });
    }

    next(error);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("update", "User")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to update a User",
    });
  }

  try {
    const { id } = req.params;
    const newpassword: string = "rahasia";

    const user = await User.findByIdAndUpdate(
      id,
      { password: newpassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        error: 1,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success reset user password",
      data: user,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: 1,
        message: "Validation Error",
        details: error.errors,
      });
    }

    next(error);
  }
}

async function statusUser(req: Request, res: Response, next: NextFunction) {
  try {
    const policy = policyFor(req.user as UserTypes);
    if (!policy.can("update", "User")) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to update a User",
      });
    }

    const { id } = req.params;
    const { is_active } = req.body;

    // update hanya field is_active
    const user = await User.findOneAndUpdate(
      { _id: id }, // filter cukup pakai id
      { is_active }, // hanya update is_active
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Success update status user!",
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

async function detailUser(req: Request, res: Response, next: NextFunction) {
  const policy = policyFor(req.user as UserTypes);
  if (!policy.can("read", "User")) {
    return res.status(403).json({
      error: 1,
      message: "You are not allowed to create a User",
    });
  }

  try {
    const { id } = req.params;
    const user = await User.findOne({
      _id: id,
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }

    return res.status(200).json({
      message: "success get user data.",
      data: user,
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

export { store, update, destroy, resetPassword, index, statusUser, detailUser };
