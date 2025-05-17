import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { BrandModel } from "./brandSizeMaterial.model";
import QueryBuilder from "../../builder/queryBuilder";
import { IBrand } from "./brandSizeMaterial.interface";

const allowedTypes = ["brand", "size", "material"];

const validateType = (type: string) => {
  if (!allowedTypes.includes(type)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid type provided");
  }
};

const createBrand = async (data: any) => {
  validateType(data.type);
  const result = await BrandModel.create(data);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create");
  }
  return result;
};

const getAllFromDB = async (type: string, query: Record<string, unknown>) => {
  validateType(type);
  const searchFields = ["name"];
  const builder = new QueryBuilder(
    BrandModel.find({ type: query.type }),
    query
  );
  const result = await builder
    .search(searchFields)
    .filter()
    .sort()
    .paginate()
    .fields().modelQuery;
  return result;
};

const getSingleFromDB = async (type: string, id: string) => {
  validateType(type);
  const result = await BrandModel.findOne({ _id: id, type });
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, `${type} not found`);
  return result;
};

const updateSingleFromDB = async (type: string, id: string, payload: any) => {
  validateType(type);
  const result = await BrandModel.findOneAndUpdate({ _id: id, type }, payload, {
    new: true,
  });
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, `${type} not found`);
  return result;
};

const deleteSingleFromDB = async (type: string, id: string) => {
  validateType(type);
  const result = await BrandModel.findOneAndDelete({ _id: id, type });
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, `${type} not found`);
  return result;
};

export const brandSizeMaterialService = {
  createBrand,
  getAllFromDB,
  getSingleFromDB,
  updateSingleFromDB,
  deleteSingleFromDB,
};
