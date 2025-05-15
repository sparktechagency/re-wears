import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IChildSubCategory } from "./childSubCategory.interface";
import { childSubCategoryModel } from "./childSubCategory.model";

const createChildSubCategoryToDB = async (payload: IChildSubCategory) => {
  const result = await childSubCategoryModel.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create child sub category"
    );
  }
  return result;
};
const getChildSubCategoriesFromDB = async (): Promise<IChildSubCategory[]> => {
  const result = await childSubCategoryModel.find({});
  if (!result) {
    return [];
  }
  return result;
};
const getChildSubCategoryByIdFromDB = async (
  id: string
): Promise<IChildSubCategory | null> => {
  const result = await childSubCategoryModel.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Child sub category not found");
  }
  return result;
};
const updateChildSubCategoryByIdFromDB = async (
  id: string,
  payload: Partial<IChildSubCategory>
) => {
  const result = await childSubCategoryModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Child sub category not found");
  }
  return result;
};
const deleteChildSubCategoryByIdFromDB = async (id: string) => {
  const result = await childSubCategoryModel.findByIdAndDelete(id);
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
