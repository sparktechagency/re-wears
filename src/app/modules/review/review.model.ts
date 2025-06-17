import { model, Schema } from "mongoose";
import { IReview, ReviewModel } from "./review.interface";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";

const Service: any = [];

const reviewSchema = new Schema<IReview, ReviewModel>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },

    },
    { timestamps: true }
);


export const Review = model<IReview, ReviewModel>("Review", reviewSchema);