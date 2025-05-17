import { JwtPayload } from "jsonwebtoken";
import { IMakeAnOffer } from "./makeanoffer.interface";
import { MakeAnOffer } from "./makeanoffer.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/queryBuilder";

const createMakeAnOfferIntoDB = async (
  payload: IMakeAnOffer,
  user: JwtPayload
) => {
  try {
    const result = await MakeAnOffer.create({
      ...payload,
      user: user.id,
    });
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Can't create offer");
    }
    return result;
  } catch (error: unknown) {
    console.warn(error);
  }
};

const getAllOfferFromDB = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  const queryBuilder = new QueryBuilder(
    MakeAnOffer.find({
      user: user.id,
    }).lean(),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryBuilder.modelQuery;
  const paginationInfo = await queryBuilder.getPaginationInfo();

  if (!result) {
    return {
      data: [],
      pagination: paginationInfo,
    };
  }
  return {
    data: result,
    pagination: paginationInfo,
  };
};

export const MakeAnOfferServices = {
  createMakeAnOfferIntoDB,
  getAllOfferFromDB,
};
