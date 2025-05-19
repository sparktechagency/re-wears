import { Types } from "mongoose";

export type IChildSubCategory = {
  name: string;
  subCategory: Types.ObjectId;
};
