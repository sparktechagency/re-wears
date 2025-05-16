import { Schema, model } from "mongoose";
import { IWishlist, WishlistModel } from "./wishlist.interface";

const wishlistSchema = new Schema<IWishlist, WishlistModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

export const Wishlist = model<IWishlist, WishlistModel>(
  "Wishlist",
  wishlistSchema
);
