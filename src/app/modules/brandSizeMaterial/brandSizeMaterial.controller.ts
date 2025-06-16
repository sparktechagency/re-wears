import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { brandSizeMaterialService } from "./brandSizeMaterial.service";

const createBrandSizeMaterial = catchAsync(
  async (req: Request, res: Response) => {
    const result = await brandSizeMaterialService.createBrand(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `${result.type} created successfully`,
      data: result,
    });
  }
);

const getAllBrandSizeMaterial = catchAsync(
  async (req: Request, res: Response) => {
    const type = req.params.type;
    const result = await brandSizeMaterialService.getAllFromDB(type, req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `All ${type}s retrieved successfully`,
      pagination: result.pagination,
      data: result.result,
    });
  }
);

const getSingleBrandSizeMaterial = catchAsync(
  async (req: Request, res: Response) => {
    const { type, id } = req.params;
    const result = await brandSizeMaterialService.getSingleFromDB(type, id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `${type} retrieved successfully`,
      data: result,
    });
  }
);

const updateBrandSizeMaterial = catchAsync(
  async (req: Request, res: Response) => {
    const { type, id } = req.params;
    const result = await brandSizeMaterialService.updateSingleFromDB(
      type,
      id,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `${type} updated successfully`,
      data: result,
    });
  }
);

const deleteBrandSizeMaterial = catchAsync(
  async (req: Request, res: Response) => {
    const { type, id } = req.params;
    const result = await brandSizeMaterialService.deleteSingleFromDB(type, id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `${type} deleted successfully`,
      data: result,
    });
  }
);

export const brandSizeMaterialController = {
  createBrandSizeMaterial,
  getAllBrandSizeMaterial,
  getSingleBrandSizeMaterial,
  updateBrandSizeMaterial,
  deleteBrandSizeMaterial,
};
