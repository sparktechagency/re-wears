import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubCategoryService } from "./subCategory.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCategoryService.createSubCategoryToDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "SubCategory create successfully",
    data: result,
  });
});

const getAllSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCategoryService.getAllSubCategoryFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "SubCategory get successfully",
    pagination: result.meta,
    data: result.data,
  });
});



const getSingleSubCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubCategoryService.getSingleSubCategoryFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "SubCategory get successfully",
    data: result,
  });
});

const updateSubCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubCategoryService.updateSubCategoryToDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "SubCategory update successfully",
    data: result,
  });
});

const deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubCategoryService.deleteSubCategoryFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "SubCategory delete successfully",
    data: result,
  });
});

export const SubCategoryController = {
  createSubCategory,
  getAllSubCategory,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
