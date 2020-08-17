import { Request, Response, NextFunction } from "express";
import { Document, Model } from "mongoose";
import { ErrorResponse } from "../api/utils/errorResponse";
export const advancedResults = (
  model: Model<Document, {}>,
  populate: string
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query;

    // Copy req.query
    let reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "limit", "page"];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // Format into MongoDB friendly operators
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );
    query = model.find(JSON.parse(queryStr));

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Select displayed fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Populate
    if (populate) {
      query = query.populate(populate);
    }

    const results = await query;

    // Pagination result
    const pagination = { next: {}, prev: {} };

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    };
  } catch (err) {
    return next(new ErrorResponse(`${err}`, 500));
  }

  next();
};
