import { model, Schema } from "mongoose";
import { IReview, ReviewModel } from "./review.interface";

const reviewSchema = new Schema<IReview, ReviewModel>(
    {
        // customer means who is giving review
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // user means who is getting review
        seller: {
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