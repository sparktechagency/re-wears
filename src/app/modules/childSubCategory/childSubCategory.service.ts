import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IChildSubCategory } from "./childSubCategory.interface";
import { ChildSubCategory } from "./childSubCategory.model";

const createChildSubCategoryToDB = async (payload: IChildSubCategory) => {
  const result = await ChildSubCategory.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create child sub category"
    );
  }
  return result;
};
const getChildSubCategoriesFromDB = async (): Promise<IChildSubCategory[]> => {
  const result = await ChildSubCategory.find({});
  if (!result) {
    return [];
  }
  return result;
};
const getChildSubCategoryByIdFromDB = async (
  id: string
): Promise<IChildSubCategory | null> => {
  const result = await ChildSubCategory.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Child sub category not found");
  }
  return result;
};
const updateChildSubCategoryByIdFromDB = async (
  id: string,
  payload: Partial<IChildSubCategory>
) => {
  const result = await ChildSubCategory.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Child sub category not found");
  }
  return result;
};
const deleteChildSubCategoryByIdFromDB = async (id: string) => {
  const result = await ChildSubCategory.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Child sub category not found");
  }
  return result;
};

export const childSubCategoryService = {
  createChildSubCategoryToDB,
  getChildSubCategoriesFromDB,
  getChildSubCategoryByIdFromDB,
  updateChildSubCategoryByIdFromDB,
  deleteChildSubCategoryByIdFromDB,
};
