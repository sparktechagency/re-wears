import { model, Schema } from "mongoose";
import { IChildSubCategory } from "./childSubCategory.interface";

const childSubCategory = new Schema<IChildSubCategory>(
  {
    name: {
      type: [String],
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const childSubCategoryModel = model<IChildSubCategory>(
  "childSubCategory",
  childSubCategory
);
