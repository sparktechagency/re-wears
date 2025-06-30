import { Request, Response, NextFunction } from "express";
import { MakeAnOfferServices } from "./makeanoffer.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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
  const user = req.user;
  const receiver = req.params.receiverId;
  const { product, price } = req.body;

  const message = await MakeAnOfferServices.sendOfferUsingMessage(user!, {
    product,
    price,
    receiver,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Offer sent successfully",
    data: message,
  });
});



const updateOfferStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await MakeAnOfferServices.offerUpdateFromDB(
    req.user!,      // JwtPayload
    req.body,       // IMakeAnOffer
    req.params.id   // string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Offer update successfully",
    data: result,
  });
});


export const MakeAnOfferController = {
  createOffer,
  getAllOffer,
  getOfferUsingSocket,
  updateOfferStatus
};
