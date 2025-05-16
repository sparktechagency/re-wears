import { Request, Response, NextFunction } from "express";
import { MakeAnOfferServices } from "./makeanoffer.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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
export const MakeAnOfferController = {
  createOffer,
};
