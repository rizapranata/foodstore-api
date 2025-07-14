import { Request, Response } from "express";

const errorhandling = (err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send({
    status: "error",
    message: "Something went wrong!",
    error: err.message,
  });
}

export default errorhandling;