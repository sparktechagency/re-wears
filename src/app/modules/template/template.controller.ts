import { Request, Response, NextFunction } from "express";
import { TemplateServices } from "./template.service";
import catchAsync from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";

// create template
const createTemplate = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateServices.createTemplate(req.body);
  res.send({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Template created successfully",
    data: result,
  });
});

// update template
const updateTemplate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TemplateServices.updateTemplate(id, req.body);
  res.send({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Template updated successfully",
    data: result,
  });
});

// delete template
const deleteTemplate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TemplateServices.deleteTemplate(id);
  res.send({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Template deleted successfully",
    data: result,
  });
})

export const TemplateController = { createTemplate, updateTemplate, deleteTemplate };
