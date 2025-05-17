import { Request, Response, NextFunction } from "express";
import { OrderServices } from "./order.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.createOrderIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Successfully create",
    data: result,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrderFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order retrieved successfully",
    pagination: result.pagination,
    data: result.result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrder,
};
