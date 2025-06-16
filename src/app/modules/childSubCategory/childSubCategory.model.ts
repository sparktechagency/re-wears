import { model, Schema } from "mongoose";
import { IChildSubCategory } from "./childSubCategory.interface";

const childSubCategorySchema = new Schema<IChildSubCategory>(
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
  { timestamps: true }
);

export const ChildSubCategory = model<IChildSubCategory>(
  "ChildSubCategory",
  childSubCategorySchema
);