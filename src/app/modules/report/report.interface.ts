import { Model, ObjectId } from "mongoose";
import { REPORT_STATUS, REPORT_TYPE } from "./report.constants";

export type IReport = {
  reportId: string;
  type: REPORT_TYPE;
  item: ObjectId;
  reporter: ObjectId;
  reason: string;
  status: REPORT_STATUS;
  createdAt: Date;
  updatedAt: Date;
};

export type ReportModel = Model<IReport>;
