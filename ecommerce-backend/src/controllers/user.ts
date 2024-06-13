import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import { NewUserRequestBody } from "../types/types.js";
import { BadRequestError, NotFoundError } from "../utils/customError.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, photo, gender, _id, dob } = req.body;

  let user = await User.findById(_id);

  if (user) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }

  if (!_id || !name || !email || !photo || !gender || !dob)
    throw new BadRequestError("Please add all fields.");

  user = await User.create({
    name,
    email,
    photo,
    gender,
    _id,
    dob: new Date(dob),
  });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: `Welcome, ${user.name}`,
  });
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find({});

  return res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  if (!user) throw new BadRequestError(`User with ID: ${id}, does not exists`);

  return res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete({ _id: id });

  if (!user) throw new BadRequestError(`User with ID: ${id}, does not exists`);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "User Deleted Successfully",
  });
};
