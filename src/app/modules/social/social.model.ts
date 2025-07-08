
import { Schema, model } from "mongoose";
import { ISocial } from "./social.interface";

const socialSchema = new Schema<ISocial>(
  {
    facebookUrl: {
      type: String,
      required: true,
    },
    instagramUrl: {
      type: String,
      required: true,
    },
    tikTokUrl: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Social = model<ISocial>("Social", socialSchema);
