import { model, Schema } from "mongoose";
import { ISubCategory } from "./subCategory.interface";

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export const SubCategory = model<ISubCategory>(
  "SubCategory",
  subCategorySchema
);