import { Types } from "mongoose";
export type IProductCategory = {
  category: Types.ObjectId;
  subCategory: Types.ObjectId;
  childSubCategory: Types.ObjectId;
};
export type IProduct = {
  user: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  condition: "LikelyNew" | "VeryGood" | "Good" | "Fair";
  brand: Types.ObjectId;
  size: Types.ObjectId;
  category: IProductCategory;
  colors: Types.ObjectId[];
  material: Types.ObjectId;
  price: number;
  status: "Active" | "Reserved" | "Sold" | "Hidden" | "Draft";
  isBlocked?: boolean;
  isDeleted?: boolean;
};
