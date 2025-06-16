import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { navService } from "./nav.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllProductBaseOnAllCategory = catchAsync(
    async (req: Request, res: Response) => {
        const { category, subCategory, childSubCategory } = req.query;

        const products = await navService.getAllProductBaseOnAllCategory({
            category: category as string,
            subCategory: subCategory as string,
            childSubCategory: childSubCategory as string,
        });

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    }
);


const getProductBaseOnCat = catchAsync(async (req: Request, res: Response) => {
    const result = await navService.getAllProductBaseOnCategory();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Category retrieved successfully",
        data: result,
    });
});





export const navController = {
    getAllProductBaseOnAllCategory,
    getProductBaseOnCat
}