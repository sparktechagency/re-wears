import mongoose, { Types } from "mongoose";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { JwtPayload } from "jsonwebtoken";

const createReviewToDB = async (user: JwtPayload, payload: IReview) => {
    const reviewData = {
        ...payload,
        buyer: user.id
    };
    const result = await Review.create(reviewData)
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create review");
    }
    return result
};

// review.service.ts
const getAllReviewsFromDB = async (
    query: Record<string, any>,
    sellerId: string
): Promise<{
    data: IReview[];
    pagination: any;
    averageRating: number;
    totalRatingCount: number;
}> => {
    const result = await Review.find({ seller: new Types.ObjectId(sellerId) });
    const stats = await Review.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(sellerId) } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalRatingCount: { $sum: 1 },
            },
        },
    ]);

    const averageRating = stats[0]?.averageRating || 0;
    return {
        averageRating,
        // @ts-ignore
        result,
    };
};


export const ReviewService = {
    createReviewToDB,
    getAllReviewsFromDB
}