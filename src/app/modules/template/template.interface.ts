import { Model, ObjectId } from "mongoose";

export interface ITemplate {
  _id?: ObjectId;
  id: string;
  name: string;
  category: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TemplateModel = Model<ITemplate>;
