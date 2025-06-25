import mongoose from "mongoose";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiErrors";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/queryBuilder";

const createReviewToDB = async (user: JwtPayload, payload: IReview): Promise<IReview> => {
    payload.customer = user.id!;
    const result = await Review.create(payload);
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
    // Step 1: Filter by seller/buyer field
    const filter: Record<string, any> = {
        buyer: sellerId, // if buyer holds sellerId
    };

    const result = new QueryBuilder(Review.find(filter), query)
        .fields()
        .sort()
        .paginate()
        .populate(['customer'], {
            customer: 'firstName lastName image',
        });

    const [data] = await Promise.all([result.modelQuery]);
    const pagination = await result.getPaginationInfo();

    const stats = await Review.aggregate([
        { $match: { buyer: new mongoose.Types.ObjectId(sellerId) } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalRatingCount: { $sum: 1 },
            },
        },
    ]);

    const averageRating = stats[0]?.averageRating || 0;
    const totalRatingCount = stats[0]?.totalRatingCount || 0;

    return {
        data,
        pagination,
        averageRating,
        totalRatingCount,
    };
};


export const ReviewService = {
    createReviewToDB,
    getAllReviewsFromDB
}