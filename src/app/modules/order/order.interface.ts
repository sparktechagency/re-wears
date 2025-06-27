import { Model, Types } from "mongoose";

export type IOrder = {
  seller: Types.ObjectId;
  product: Types.ObjectId;
  buyer: Types.ObjectId;
  status: "Reserved" | "Completed" | "Cancelled";
};

export type OrderModel = Model<IOrder>;
