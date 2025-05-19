import QueryBuilder from "../../builder/queryBuilder";
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

// delete template
const deleteTemplate = async (id: string) => {
  const isExist = await Template.findById(id);
  if (!isExist) {
    throw new Error("Template not found");
  }

  const result = await Template.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Failed to delete template");
  }
  return result;
};

// get single template
const getSingleTemplate = async (id: string) => {
  const result = await Template.findById(id);
  if (!result) {
    throw new Error("Template not found");
  }
  return result;
};

// get all templates
const getAllTemplates = async (query: Record<string, unknown>) => {
  const templateQuery = new QueryBuilder(Template.find({}), query)
    .search(["name", "category", "message", "id"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await templateQuery.modelQuery;
  const total = await Template.countDocuments(
    templateQuery.modelQuery.getFilter()
  );

  return {
    meta: {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      total,
    },
    data: result,
  };
};
export const TemplateServices = {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getSingleTemplate,
  getAllTemplates,
};
