import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../utils/customError.js";
import { User } from "../models/user.js";

export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  // Check if user is authenticated
  if (!id) {
    throw new UnauthenticatedError(
      "Authentication failed. User ID is missing or invalid."
    );
  }

  // Fetch user details
  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    throw new NotFoundError(`User with ID ${id} not found.`);
  }

  // Check if user exists
  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found.`);
  }

  // Check if user is admin
  if (user.role !== "admin") {
    throw new UnauthorizedError("Admin access required for this operation.");
  }

  // If all checks pass, proceed to next middleware
  next();
};

// "api/v1/users/1234/?key=24"
// here query is key = 24
// params is :id which is 1234
