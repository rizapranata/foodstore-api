import { Request, Response } from "express";

export const loging = (req: Request, res: Response, next: Function) => {
  console.log(`${Date.now()}: ${req.method} ${req.url}`);
  next();
};
