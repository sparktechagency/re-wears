import { model, Schema } from "mongoose";
import { ISubCategory } from "./subCategory.interface";

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      enum: ["All", "Clothing", "Shoes", "Bags", "Accessories", "Beauty"],
      required: true,
      unique: true,
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
  {
    timestamps: true,
  }
);
export const subCategoryModel = model<ISubCategory>("subCategory", subCategorySchema);
