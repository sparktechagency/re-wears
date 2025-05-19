import { Request, Response, NextFunction } from "express";
import { TemplateServices } from "./template.service";
import catchAsync from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";

const createTemplate = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateServices.createTemplate(req.body);
  res.send({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Template created successfully",
    data: result,
  });
});

export const TemplateController = { createTemplate };
