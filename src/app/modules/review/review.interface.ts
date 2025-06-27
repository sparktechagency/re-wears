import { Model, Types } from "mongoose";

export type IReview = {
    buyer: Types.ObjectId;
    seller: Types.ObjectId;
    rating: number;
    message: string;
}

export type ReviewModel = Model<IReview>;