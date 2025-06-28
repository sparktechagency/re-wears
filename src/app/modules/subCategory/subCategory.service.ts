import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ISubCategory } from "./subCategory.interface";
import { SubCategory } from "./subCategory.model";
import QueryBuilder from "../../builder/queryBuilder";
import { FilterQuery } from "mongoose";

const createSubCategoryToDB = async (payload: ISubCategory) => {

  const isExist = await SubCategory.findOne({ name: payload.name, category: payload.category });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "SubCategory already exist");
  }
  const result = await SubCategory.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create subCategory");
  }
  return result;
};

const getAllSubCategoryFromDB = async (query: Record<string, any>) => {
  const searchTerm = query.searchTerm || query.seachTerm || "";
  const restQuery = { ...query };
  delete restQuery.searchTerm;
  delete restQuery.seachTerm;

  const filter: FilterQuery<ISubCategory> = {};

  if (searchTerm) {
    filter.name = { $regex: searchTerm, $options: "i" };
  }

  // rest same as before
  const subCategoryQuery = SubCategory.find(filter);

  const queryBuilder = new QueryBuilder<ISubCategory>(subCategoryQuery, restQuery)
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(["category"], { name: 1 });

  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.getPaginationInfo();

  return {
    meta,
    data: result,
  };
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
  payload: ISubCategory
) => {
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
