import { Request, Response, NextFunction } from "express";
import { WishlistServices } from "./wishlist.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createWishList = catchAsync(async (req: Request, res: Response) => {
  //   console.log("Body======>", req.body);
  //   console.log("user======>", req.user);
  const result = await WishlistServices.createWishListIntoDB(
    req.body,
    req.user!
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Create successfully",
    data: result,
  });
});
// * get all

const getAllWishList = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistServices.getAllWishListFromDB(
    req.user!,
    req.query
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get all message",
    pagination:
      result && "pagination" in result ? result.pagination : undefined,
    data: result && "data" in result ? result.data : result,
  });
});
export const WishlistController = {
  createWishList,
  getAllWishList,
};
