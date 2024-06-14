import { NextFunction, Request, Response } from "express";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../utils/customError.js";

export const newOrder = async (
  req: Request<{}, {}, NewOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const {
    shippingInfo,
    orderItems,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
  } = req.body;

  if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
    throw new BadRequestError("Please Enter All Fields");
  }

  await Order.create({
    shippingInfo,
    orderItems,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
  });

  await reduceStock(orderItems);

  await invalidateCache({ product: true, order: true, admin: true });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Order Placed Successfully",
  });
};
