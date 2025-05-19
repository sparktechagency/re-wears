import { model, Schema } from "mongoose";
import { IBrandSizeMaterial } from "./brandSizeMeterial.interface";

const brandSchema = new Schema<IBrandSizeMaterial>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["brand", "material", "size"],
    },
  },
  { timestamps: true }
);
export const BrandModel = model<IBrandSizeMaterial>("Brand", brandSchema);
