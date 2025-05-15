import { Schema, model } from "mongoose";
import { IColor, ColorModel } from "./color.interface";

const colorSchema = new Schema<IColor, ColorModel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  hexCode: {
    type: String,
    required: true,
    unique: true,
  },
},{
  timestamps: true,
});

export const Color = model<IColor, ColorModel>("Color", colorSchema);
