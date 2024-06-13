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
  } else {
    // Handle errors that are not your custom errors (e.g., programming errors)
    console.error(error.stack); // Log the error for debugging
  }

  const message = error.message || "Something went wrong, try again later";

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};
