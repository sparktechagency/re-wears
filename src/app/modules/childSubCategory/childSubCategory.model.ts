import { model, Schema } from "mongoose";
import { IChildSubCategory } from "./childSubCategory.interface";

const childSubCategory = new Schema<IChildSubCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const childSubCategoryModel = model<IChildSubCategory>(
  "ChildSubCategory",
  childSubCategory
);
