import { Types } from "mongoose";

export type IChildSubCategory = {
  name: [string];
  subcategory: Types.ObjectId;
};
