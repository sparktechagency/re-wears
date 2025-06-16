import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productImage: {
      type: [String],
      required: true,
    },
    condition: {
      type: String,
      enum: ["Like New", "Very Good", "Good", "Fair"],
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    size: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    material: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
      },
      childSubCategory: {
        type: Schema.Types.ObjectId,
        ref: "ChildSubCategory",
        required: true,
      },
    },
    colors: {
      type: [Schema.Types.ObjectId],
      ref: "Color",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Reserved", "Sold", "Hidden", "Draft"],
      required: true,
      default: "Active"
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
