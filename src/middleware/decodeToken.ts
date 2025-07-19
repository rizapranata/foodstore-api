import { Request, Response, NextFunction } from "express";
import getToken from "../utils/getToken";
import jwt from "jsonwebtoken";
import User from "../user/model";
import { SECRET_KEY } from "../config";

export default function decodeToken() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = getToken(req);
      if (!token) return next();

      req.user = jwt.verify(token, SECRET_KEY);

      const user = await User.findOne({ token: { $in: [token] } });
      if (!user) {
        return res.status(401).json({ error: 1, message: "Unauthorized" });
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 1, message: error.message });
      }
      next(error);
    }
    return next();
  };
}
