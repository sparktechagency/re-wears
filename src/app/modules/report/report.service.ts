import { IReport } from "./report.interface";
import { Report } from "./report.model";
import QueryBuilder from "../../builder/queryBuilder";
import generateSequentialId from "../../utils/idGenerator";

// create report
const createReport = async (payload: IReport, user: any) => {
  // Generate a unique report ID
  const reportId = await generateSequentialId(Report, "reportId", "", 3);

  // Add the report ID to the payload
  const reportData = {
    ...payload,
    reportId,
    reporter: user.id,
  };

  const result = await Report.create(reportData);
  if (!result) {
    throw new Error("Failed to create report");
  }

  return result;
};

// update report status
const updateReportStatus = async (id: string, payload: Partial<IReport>) => {
  const isExist = await Report.findById(id);
  if (!isExist) {
    throw new Error("Report not found");
  }

  const result = await Report.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new Error("Failed to update report status");
  }
  return result;
};

// get all reports with searching and filtering
const getAllReports = async (query: Record<string, unknown>) => {
  const reportSearchableFields = ["reportId", "reason", "status"];

  // Use the base query with populate
  const reportQuery = new QueryBuilder(
    Report.find({}).populate(["item", "reporter"]),
    query
  )
    .search(reportSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reportQuery.modelQuery;
  const total = await Report.countDocuments(reportQuery.modelQuery.getFilter());

  return {
    meta: {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      total,
    },
    data: result,
  };
};

export const ReportServices = {
  createReport,
  updateReportStatus,
  getAllReports,
};
