import { Request, Response } from "express";
import { CmsServices } from "./cms.service";
import catchAsync from "../../../shared/catchAsync";

// create or update cms
const createOrUpdateCms = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.body;
  const result = await CmsServices.createOrUpdateCms(type, req.body);
  res.status(200).json({
    success: true,
    message: "Cms updated successfully",
    data: result,
  });
});

// get cms
const getCms = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.params;
  const result = await CmsServices.getCms(type);
  res.status(200).json({
    success: true,
    message: "Cms fetched successfully",
    data: result,
  });
});

export const CmsController = { createOrUpdateCms, getCms };
