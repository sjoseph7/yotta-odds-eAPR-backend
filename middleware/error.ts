import { ErrorResponse } from "../api/utils/errorResponse";
import { Request, Response, NextFunction } from "express";
import { MongoError } from "mongodb";
import { Mongoose } from "mongoose";
import colors from "colors";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Copy error
  let error = { ...err };

  error.message = err.message;
  console.error(colors.red(`${err.name} (Code: ${err.code}): ${err.message}`));

  // ? Needed?
  // if (res.headersSent) {
  //   return next(err);
  // }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    if (typeof err.value !== "string") {
      console.log(JSON.stringify(err.value));
    }
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(
      (value: any) => value.message
    );
    error = new ErrorResponse(message.join(", "), 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
}
