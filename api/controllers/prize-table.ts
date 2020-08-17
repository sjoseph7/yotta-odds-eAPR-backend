import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import { PrizeTable } from "../models/PrizeTable";

// @desc    Get all prize-tables
// @route   GET /api/v1/prize-tables
// @access  Public
export const getPrizeTables = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!res.advancedResults) {
      return next(new ErrorResponse(`Server error`, 500));
    }
    res.status(200).json(res.advancedResults);
  }
);
