import { Model, Types } from "mongoose";

export type IMakeAnOffer = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  price: number;
};

export type MakeAnOfferModel = Model<IMakeAnOffer>;
