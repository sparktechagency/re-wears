import { Request, Response, NextFunction } from "express";
import { MakeAnOfferServices } from "./makeanoffer.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
const createOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await MakeAnOfferServices.createMakeAnOfferIntoDB(
    req.body,
    req.user!
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Offer create successfully",
    data: result,
  });
});

const getAllOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await MakeAnOfferServices.getAllOfferFromDB(
    req.user!,
    req.query
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    pagination: result.pagination,
    data: result.data,
  });
});

const getOfferUsingSocket = catchAsync(async (req: Request, res: Response) => {
  const result = await MakeAnOfferServices.sendOfferUsingMessage(
    req.user!,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Offer send successfully",
    data: result,
  });
});


export const MakeAnOfferController = {
  createOffer,
  getAllOffer,
  getOfferUsingSocket
};
