import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { productService } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.createProduct(req.body, req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Product created successfully`,
    data: result,
  });
});
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `All products retrieved successfully`,
    pagination: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.getSingleProductIntoDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Product retrieved successfully`,
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.updateProductFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Product updated successfully`,
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
};
