import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { profileService } from "./profile.service";
import sendResponse from "../../../shared/sendResponse";

const getAllProductBaseOnStatusFromDB = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId
    const result = await profileService.getAllProductsFilterByStatus(userId!, req.query)
    const statuses = result.productsWithWishlistCount.map(product => product.status).join(', ');
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `All ${statuses} products fetched successfully`,
        pagination: result.pagination,
        data: result.productsWithWishlistCount
    })
})
const getAllMyOrdersFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id }: any = req.user
    console.log(id);
    const result = await profileService.getAllMyOrdersFromDB(id!, req.query)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All orders my product successfully",
        pagination: result.pagination,
        data: result.data
    })
})


export const profileController = {
    getAllProductBaseOnStatusFromDB,
    getAllMyOrdersFromDB
}