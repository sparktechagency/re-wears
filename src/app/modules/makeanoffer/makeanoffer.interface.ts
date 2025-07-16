import { Model, Types } from "mongoose";

export type IMakeAnOffer = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  price: number;
  offerStatus: "pending" | "accepted" | "rejected";
};

export type MakeAnOfferModel = Model<IMakeAnOffer>;
