import { Request } from "express";

export default function getToken(req: Request): string | null {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  return token && token.length ? token : null;
}
