import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ISubCategory } from "./subCategory.interface";
import { SubCategory } from "./subCategory.model";

const createSubCategoryToDB = async (payload: ISubCategory) => {
  const result = await SubCategory.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create subCategory");
  }
  return result;
};

const getAllSubCategoryFromDB = async (): Promise<ISubCategory[]> => {
  const result = await SubCategory.find().populate("category");
  if (!result) {
    return [];
  }
  return result;
};

const getSingleSubCategoryFromDB = async (
  id: string
): Promise<ISubCategory | null> => {
  const result = await SubCategory.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
  }
  return result;
};

const updateSubCategoryToDB = async (
  id: string,
  payload: Partial<ISubCategory>
): Promise<ISubCategory | null> => {
  const result = await SubCategory.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
  }
  return result;
};

const deleteSubCategoryFromDB = async (
  id: string
): Promise<ISubCategory | null> => {
  const result = await SubCategory.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "SubCategory not found");
  }
  return result;
};
export const SubCategoryService = {
  createSubCategoryToDB,
  getAllSubCategoryFromDB,
  getSingleSubCategoryFromDB,
  updateSubCategoryToDB,
  deleteSubCategoryFromDB,
};
