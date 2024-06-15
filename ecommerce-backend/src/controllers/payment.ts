import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NewCouponRequestBody } from "../types/types.js";
import { Coupon } from "../models/coupon.js";
import { BadRequestError, NotFoundError } from "../utils/customError.js";

export const newCoupon = async (
  req: Request<{}, {}, NewCouponRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { code, amount } = req.body;

  if (!code || !amount) throw new BadRequestError("Please enter all fields.");

  await Coupon.create({ code, amount });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: `Coupon ${code} Created Successfully`,
  });
};

export const applyDiscount = async (
  req: Request<{}, {}, NewCouponRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { coupon } = req.query;

  if (!coupon) throw new BadRequestError("Please enter all fields.");

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) throw new BadRequestError("Invalid coupon code");

  return res.status(StatusCodes.OK).json({
    success: true,
    discount: discount.amount,
  });
};

export const allCoupons = async (
  req: Request<{}, {}, NewCouponRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const coupons = await Coupon.find({});
  return res.status(StatusCodes.OK).json({
    success: true,
    coupons,
  });
};

export const deleteCoupon = async (
  req: Request<{ id: number }, {}, NewCouponRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon) throw new NotFoundError(`Coupon with ID: ${id} does not exits`);

  await Coupon.deleteOne();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: `Coupon ${coupon.code} Deleted Successfully`,
  });
};
