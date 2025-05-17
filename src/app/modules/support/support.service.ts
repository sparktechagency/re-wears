import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ISupport } from "./support.interface";
import { Support } from "./support.model";
import QueryBuilder from "../../builder/queryBuilder";

// create support
const createSupportIntoDB = async (payload: ISupport) => {
  const result = await Support.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create support ticket"
    );
  }
  return result;
};

// update support status
const updateSupportIntoDB = async (id: string, payload: Partial<ISupport>) => {
  const existingSupport = await Support.findById(id);
  if (!existingSupport) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Support ticket not found");
  }

  const result = await Support.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to update support ticket"
    );
  }
};

// delete support
const deleteSupportIntoDB = async (id: string) => {
  const existingSupport = await Support.findById(id);
  if (!existingSupport) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Support ticket not found");
  }

  const result = await Support.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to delete support ticket"
    );
  }
  return result;
};

// get all support
const getAllSupportFromDB = async (query: Record<string, unknown>) => {
  const supportQuery = new QueryBuilder(Support.find({}), query)
    .search(["name", "email", "phone", "subject"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await supportQuery.modelQuery;
  const total = await Support.countDocuments(
    supportQuery.modelQuery.getFilter()
  );

  return {
    meta: {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      total,
    },
    data: result,
  };
};

export const SupportServices = {
  createSupportIntoDB,
  getAllSupportFromDB,
};
