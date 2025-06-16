import { model, Schema } from "mongoose";
import { ICategory, CategoryModel } from "./category.interface";

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: {
      type: String,
      enum: ["WOMEN", "MEN", "KIDS", "BEAUTY/GROOMING"],
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Category = model<ICategory, CategoryModel>(
  "Category",
  categorySchema
);
