import { Request } from "express";

export default function getToken(req: Request): string | null {
  const token = req.headers["authorization"];
  if (typeof token === "string") {
    return token.replace("Bearer ", "");
  }
  return null;
}