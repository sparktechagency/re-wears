import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import unlinkFile from "../../../shared/unlinkFile";
import { Bookmark } from "../bookmark/bookmark.model";

const createCategoryToDB = async (payload: ICategory) => {
  const { name } = payload;
  const isExistName = await Category.findOne({ name: name });
  if (isExistName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category already exist");
  }
  const createCategory: any = await Category.create(payload);

  return createCategory;
};

const getCategoriesFromDB = async (): Promise<ICategory[]> => {
  const result = await Category.find({});
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  return result;
};

const updateCategoryToDB = async (id: string, payload: ICategory) => {
  const isExistCategory: any = await Category.findById(id);

  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  const updateCategory = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateCategory;
};

const deleteCategoryToDB = async (id: string): Promise<ICategory | null> => {
  const deleteCategory = await Category.findByIdAndDelete(id);
  if (!deleteCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  return deleteCategory;
};

const getSingleCategoryFromDB = async (
  id: string
): Promise<ICategory | null> => {
  const result = await Category.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  return result;
};

export const CategoryService = {
  createCategoryToDB,
  getCategoriesFromDB,
  updateCategoryToDB,
  deleteCategoryToDB,
  getSingleCategoryFromDB
};
