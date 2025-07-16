import { Model } from "mongoose";

export type ISocial = {
  facebookUrl: string;
  instagramUrl: string;
  tikTokUrl: string;
  email: string;
};

export type SocialModel = Model<ISocial>;
