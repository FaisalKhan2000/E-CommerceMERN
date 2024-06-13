import { StatusCodes } from "http-status-codes";

export class MyCustomError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends MyCustomError {
  constructor(public message: string) {
    super(message, StatusCodes.NOT_FOUND);
    this.name = "NotFoundError";
  }
}
export class BadRequestError extends MyCustomError {
  constructor(public message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = "BadRequestError";
  }
}
export class UnauthenticatedError extends MyCustomError {
  constructor(public message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = "UnauthenticatedError";
  }
}
export class UnauthorizedError extends MyCustomError {
  constructor(public message: string) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = "UnauthorizedError";
  }
}
