
import { Types } from "mongoose";

export type ISubCategory = {
  name: "All" | "Clothing" | "Shoes" | "Bags" | "Accessories" | "Beauty";
  icon: string;
  category: Types.ObjectId;
};
