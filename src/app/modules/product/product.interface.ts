import { Types } from "mongoose";

export type IProduct = {
  _id?: any,
  user: Types.ObjectId;
  name: string;
  description: string;
  productImage: string[];
  condition: "Like New" | "Very Good" | "Good" | "Fair";
  brand: string;
  size: Types.ObjectId;
  category: {
    category: Types.ObjectId;
    subCategory: Types.ObjectId;
    childSubCategory: Types.ObjectId;
  };
  colors: Types.ObjectId[];
  material?: Types.ObjectId;
  price: number;
  status: "Active" | "Reserved" | "Sold" | "Hidden" | "Draft";
  isBlocked?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
