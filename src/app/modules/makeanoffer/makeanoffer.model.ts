import { Schema, model } from "mongoose";
import { IMakeAnOffer, MakeAnOfferModel } from "./makeanoffer.interface";

const makeAnOfferSchema = new Schema<IMakeAnOffer, MakeAnOfferModel>({

  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  price: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  offerStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  }
});

export const MakeAnOffer = model<IMakeAnOffer, MakeAnOfferModel>(
  "MakeAnOffer",
  makeAnOfferSchema
);
