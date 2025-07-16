import { Schema, model } from 'mongoose';
import { ISocial, SocialModel } from './social.interface';

const socialSchema = new Schema<ISocial, SocialModel>(
  {
    facebookUrl: { type: String, required: true },
    instagramUrl: { type: String, required: true },
    tikTokUrl: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Social = model<ISocial, SocialModel>('Social', socialSchema);
