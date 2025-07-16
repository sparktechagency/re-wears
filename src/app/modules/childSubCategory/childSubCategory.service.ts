import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IChildSubCategory } from "./childSubCategory.interface";
import { ChildSubCategory } from "./childSubCategory.model";
import QueryBuilder from "../../builder/queryBuilder";

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

// get all child sub categories
const getChildSubCategoriesFromDB = async (
  query: Record<string, unknown>
): Promise<{ data: IChildSubCategory[]; meta: Record<string, any> }> => {
  const modelQuery = ChildSubCategory.find();

  const queryBuilder = new QueryBuilder<IChildSubCategory>(modelQuery, query);

  const resultQuery = queryBuilder
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await resultQuery.modelQuery
    .populate({
      path: 'subCategory',
      populate: {
        path: 'category',
        select: 'name',
      },
      select: 'name category',
    });

  const meta = await resultQuery.getPaginationInfo();

  return { data, meta };
};

// get single oe child sub category

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
