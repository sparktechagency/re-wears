import { Types } from "mongoose";

export type IProduct = {
  user: Types.ObjectId;
  name: string;
  description: string;
  productImage: string[];
  condition: "LikelyNew" | "VeryGood" | "Good" | "Fair";
  brand: Types.ObjectId;
  size: Types.ObjectId;
   category: {
    category: Types.ObjectId;
    subCategory: Types.ObjectId;
    childSubCategory: Types.ObjectId;
  };
  colors: Types.ObjectId[];
  material: Types.ObjectId;
  price: number;
  status: "Active" | "Reserved" | "Sold" | "Hidden" | "Draft";
  isBlocked?: boolean;
  isDeleted?: boolean;
};
