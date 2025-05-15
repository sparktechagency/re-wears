import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IColor } from "./color.interface";
import { Color } from "./color.model";
import QueryBuilder from "../../builder/queryBuilder";

const createColor = async (payload: IColor): Promise<IColor> => {
  const result = await Color.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create color");
  }
  return result;
};

const getAllColors = async (query: Record<string, unknown>): Promise<IColor[]> => {
  const searchableFields = ['name', 'code']; // Add your color model's searchable fields
  
  const colorQuery = new QueryBuilder<IColor>(Color.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await colorQuery.modelQuery;
  
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get colors");
  }
  return result;
};

const getSingleColor = async (id: string): Promise<IColor | null> => {
  const result = await Color.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get color");
  }
  return result;
};
const updateColor = async (
  id: string,
  payload: Partial<IColor>
): Promise<IColor | null> => {
  const result = await Color.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update color");
  }
  return result;
};
const deleteColor = async (id: string): Promise<IColor | null> => {
  const result = await Color.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete color");
  }
  return result;
};

export const ColorServices = {
  createColor,
  getAllColors,
  getSingleColor,
  updateColor,
  deleteColor,
};
