import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MyCustomError } from "../utils/customError.js";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  // Check if error is a custom error with statusCode property
  if (error instanceof MyCustomError) {
    statusCode = error.statusCode;
  }

  if (error.name === "CastError") {
    error.message = "Invalid ID";
  }

  const message = error.message || "Something went wrong, try again later";

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};
