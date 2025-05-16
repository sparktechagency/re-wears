import { JwtPayload } from "jsonwebtoken";
import { IMakeAnOffer } from "./makeanoffer.interface";
import { MakeAnOffer } from "./makeanoffer.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";

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
export const MakeAnOfferServices = {
  createMakeAnOfferIntoDB,
};
