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

const getAllReviews = async (query: Record<string, any>): Promise<{ data: IReview[], pagination: any }> => {
    const result = new QueryBuilder(Review.find(), query)
        .fields()
        .sort()
        .paginate().populate(['customer'], {
            customer: 'firstName lastName image',
        });

    if (!result) {
        return {
            data: [],
            pagination: {
                total: 0,
                limit: 10,
                page: 1,
                totalPage: 0
            }
        };
    }

    const [data,] = await Promise.all([
        result.modelQuery
    ]);
    const stats = await Review.aggregate([
        { $match: result.modelQuery.getFilter() },
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
        // @ts-ignore
        averageRating,
        totalRatingCount
    };
}


export const ReviewService = {
    createReviewToDB,
    getAllReviews
}