import { Schema, model } from "mongoose";
import { IReport, ReportModel } from "./report.interface";
import { REPORT_STATUS, REPORT_TYPE } from "./report.constants";

const reportSchema = new Schema<IReport, ReportModel>(
  {
    reportId: { type: String, required: true },
    type: { type: String, enum: Object.values(REPORT_TYPE), required: true },
    item: { type: Schema.Types.ObjectId, required: true, refPath: "type" },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = model<IReport, ReportModel>("Report", reportSchema);
