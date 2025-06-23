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

// Get top sellers and buyers based on order count
const getTopSellersAndBuyers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderServices.getTopSellersAndBuyers(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Sellers and buyers retrieved successfully",
      // @ts-ignore
      pagination: result.meta,
      data: result.data,
    });
  })


// update
const updateOrderByProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await OrderServices.updateOrderByProductId(productId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order updated successfully using productId",
    data: result,
  });
});


export const OrderController = {
  createOrder,
  getAllOrder,
  getTopSellersAndBuyers,
  updateOrderByProduct
};
