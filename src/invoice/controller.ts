import { Request, Response, NextFunction } from "express";
import InvoiceModel from "./model";
import { policyFor } from "../policy";
import { UserTypes } from "../types/user.types";
import { subject } from "@casl/ability";

async function show(req: Request, res: Response, next: NextFunction) {
  const user = req.user as UserTypes;
  const policy = policyFor(user);
  // if (!policy.can("view", "Invoice")) {
  //   return res.status(403).json({
  //     error: 1,
  //     message: "You are not allowed to view this invoice",
  //   });
  // }

  try {
    const { order_id } = req.params;
    const invoice = await InvoiceModel.findById(order_id)
      .populate("order")
      .populate("user");

    const subjectInvoice = subject("Invoice", {
      user: invoice?.user?._id,
    });

    if (!policy.can("view", subjectInvoice as any)) {
      return res.status(403).json({
        error: 1,
        message: "You are not allowed to view this invoice",
      });
    }

    if (!invoice) {
      return res.status(404).json({
        error: 1,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

export { show };
