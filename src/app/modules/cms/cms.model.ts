import { Schema, model } from "mongoose";
import { ICms, CmsModel } from "./cms.interface";
import { CmsType } from "./cms.constants";

const cmsSchema = new Schema<ICms, CmsModel>(
  {
    type: {
      type: String,
      enum: Object.values(CmsType),
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Cms = model<ICms, CmsModel>("Cms", cmsSchema);
