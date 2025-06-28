import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { childSubCategoryService } from "./childSubCategory.service";

const createChildSubCategory = catchAsync(async (req, res) => {
  const { ...childSubCategoryData } = req.body;

  const result = await childSubCategoryService.createChildSubCategoryToDB(
    childSubCategoryData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Child subcategory created successfully",
    data: result,
  });
});
const getAllChildSubCategories = catchAsync(async (req, res) => {
  const result = await childSubCategoryService.getChildSubCategoriesFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Child subcategories retrieved successfully",
    pagination: result.meta,
    data: result.data,
  });
});

const getSingleChildSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await childSubCategoryService.getChildSubCategoryByIdFromDB(
    id
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Child subcategory retrieved successfully",
    data: result,
  });
});

const updateChildSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await childSubCategoryService.updateChildSubCategoryByIdFromDB(
    id,
    updatedData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Child subcategory updated successfully",
    data: result,
  });
});

const deleteChildSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await childSubCategoryService.deleteChildSubCategoryByIdFromDB(
    id
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Child subcategory deleted successfully",
    data: result,
  });
});

export const childSubCategoryController = {
  createChildSubCategory,
  getAllChildSubCategories,
  getSingleChildSubCategory,
  updateChildSubCategory,
  deleteChildSubCategory,
};
