import { Model } from "mongoose";
export type ICategory = {
  name: "WOMEN" | "MEN" | "KIDS" | "BEAUTY/GROOMING";
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
