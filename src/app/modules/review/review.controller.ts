import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await ReviewService.createReviewToDB(user!, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review Created Successfully",
        data: result
    })
})

const getAllReview = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getAllReviewsFromDB(req.query, req.params?.id!);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review Fetched Successfully",
        data: result,

    })
})

export const ReviewController = {
    createReview,
    getAllReview
}