import { Request, Response, NextFunction } from "express";
import { SupportServices } from "./support.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";

const createSupport = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportServices.createSupportIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Support Created Successfully",
    data: result,
  });
});

const getAllSupport = catchAsync(async (req: Request, res: Response) => {
  const result = await SupportServices.getAllSupportFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Support fetched successfully",
    data: result,
  });
});

export const SupportController = { createSupport, getAllSupport };
