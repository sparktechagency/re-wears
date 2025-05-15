import { Model } from "mongoose";

export type IColor = {
  name: string;
  hexCode: string;
};

export type ColorModel = Model<IColor>;
