import generateSequentialId from "../../utils/idGenerator";
import { TemplateModel } from "./template.interface";
import { Template } from "./template.model";

// create template
const createTemplate = async (payload: TemplateModel) => {
  const isExist = await Template.findOne({ name: payload.name });
  if (isExist) {
    throw new Error("Template already exist");
  }
  // generate sequence id
  const id = await generateSequentialId(Template, "id");

  const result = await Template.create({ id, ...payload });
  if (!result) {
    throw new Error("Failed to create template");
  }

  return result;
};

// update template
const updateTemplate = async (id: string, payload: Partial<TemplateModel>) => {
  const isExist = await Template.findById(id);
  if (!isExist) {
    throw new Error("Template not found");
  }

  const result = await Template.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error("Failed to update template");
  }
  return result;
};

export const TemplateServices = { createTemplate, updateTemplate };
