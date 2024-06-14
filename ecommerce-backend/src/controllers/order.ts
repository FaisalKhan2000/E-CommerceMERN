import { NextFunction, Request, Response } from "express";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../utils/customError.js";
import { myCache } from "../app.js";

export const myOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  let orders;

  if (myCache.has(`my-orders-${id}`)) {
    orders = JSON.parse(myCache.get(`my-orders-${id}`) as string);
  } else {
    orders = await Order.find({ user: id });
    myCache.set(`my-orders-${id}`, JSON.stringify(orders));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    orders,
  });
};

export const allOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let orders;

  if (myCache.has(`all-orders`)) {
    orders = JSON.parse(myCache.get(`all-orders`) as string);
  } else {
    orders = await Order.find().populate("user", "name");
    myCache.set(`all-orders`, JSON.stringify(orders));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    orders,
  });
};

export const getSingleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  let order;

  if (myCache.has(`order-${id}`)) {
    order = JSON.parse(myCache.get(`order-${id}`) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) throw new NotFoundError(`Order with OrderID: ${id} not found.`);
    myCache.set(`order-${id}`, JSON.stringify(order));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    order,
  });
};

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

  const order = await Order.create({
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

  await invalidateCache({
    product: true,
    order: true,
    admin: true,
    userId: user,
    productId: order.orderItems.map((i) => String(i.productId)),
  });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Order Placed Successfully",
  });
};

export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) throw new NotFoundError(`Order with OrderID: ${id} not found.`);

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Order Processed Successfully",
  });
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) throw new NotFoundError(`Order with OrderID: ${id} not found.`);

  await order.deleteOne();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Order Deleted Successfully",
  });
};
