import { Types } from "mongoose";

export type ISubCategory = {
  name: string;
  icon: string;
  category: Types.ObjectId;
};
