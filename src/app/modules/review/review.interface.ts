import { Model, Types } from "mongoose";

export type IReview = {
    customer: Types.ObjectId;
    user: Types.ObjectId;
    rating: number;
    message: string;
}

export type ReviewModel = Model<IReview>;