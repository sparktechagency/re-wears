import { model, Schema } from "mongoose";
import { IBrand } from "./brandSizeMaterial.interface";

const brandSchema = new Schema<IBrand>(
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
export const BrandModel = model<IBrand>("Brand", brandSchema);
