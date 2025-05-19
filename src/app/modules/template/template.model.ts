import { Schema, model } from "mongoose";
import { ITemplate, TemplateModel } from "./template.interface";

const templateSchema = new Schema<ITemplate, TemplateModel>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Template = model<ITemplate, TemplateModel>(
  "Template",
  templateSchema
);
