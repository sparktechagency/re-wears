import { z } from "zod";
import { REPORT_STATUS, REPORT_TYPE } from "./report.constants";

const createReportZodSchema = z.object({
  body: z.object({
    type: z.enum(Object.values(REPORT_TYPE) as [string, ...string[]], {
      required_error: "Type is required",
    }),
    item: z.string({
      required_error: "Item is required",
    }),
    reason: z.string({
      required_error: "Reason is required",
    }),
  }),
});

const updateReportZodSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(REPORT_STATUS) as [string, ...string[]], {
      required_error: "Status is required",
    }),
  }),
});

export const ReportValidations = {
  createReportZodSchema,
  updateReportZodSchema,
};
