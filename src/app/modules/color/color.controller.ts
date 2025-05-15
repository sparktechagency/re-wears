import { Request, Response, NextFunction } from "express";
import { ColorServices } from "./color.service";
import catchAsync from "../../../shared/catchAsync";

const createColor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...colorData } = req.body;
    const result = await ColorServices.createColor(colorData);
    res.status(200).json({
      success: true,
      message: "Color created successfully",
      data: result,
    });
  }
);

const getAllColors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ColorServices.getAllColors(req.query);
    res.status(200).json({
      success: true,
      message: "Colors fetched successfully",
      data: result,
    });
  }
);

const getSingleColor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await ColorServices.getSingleColor(id);
    res.status(200).json({
      success: true,
      message: "Color fetched successfully",
      data: result,
    });
  }
);
const updateColor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { ...colorData } = req.body;
    const result = await ColorServices.updateColor(id, colorData);
    res.status(200).json({
      success: true,
      message: "Color updated successfully",
      data: result,
    });
  }
);
const deleteColor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await ColorServices.deleteColor(id);
    res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      data: result,
    });
  }
);

export const ColorController = {
  createColor,
  getAllColors,
  getSingleColor,
  updateColor,
  deleteColor,
};
