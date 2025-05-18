import { Request, Response, NextFunction } from "express";
import { ReportServices } from "./report.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IReport } from "./report.interface";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../user/user.interface";

// create report
const createReport = catchAsync(async (req: Request, res: Response) => {
  const { ...reportData } = req.body;
  const result = await ReportServices.createReport(
    reportData,
    req.user as IUser
  );
  sendResponse<IReport>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Report created successfully",
    data: result,
  });
});

// update report status
const updateReportStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...reportData } = req.body;
  const result = await ReportServices.updateReportStatus(id, reportData);
  sendResponse<IReport>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Report status updated successfully",
    data: result,
  });
});

// get all reports
const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServices.getAllReports(req.query);
  sendResponse<{
    meta: { page: number; limit: number; total: number };
    data: IReport[];
  }>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reports retrieved successfully",
    data: result,
  });
});

export const ReportController = {
  createReport,
  updateReportStatus,
  getAllReports,
};
