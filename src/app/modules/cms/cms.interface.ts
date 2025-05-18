import { Model } from "mongoose";
import { CmsType } from "./cms.constants";

export type ICms = {
  type: CmsType;
  content?: string;
};

export type CmsModel = Model<ICms>;
