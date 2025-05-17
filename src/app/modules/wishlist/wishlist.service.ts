import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IWishlist, WishlistModel } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/queryBuilder";

const createWishListIntoDB = async (payload: IWishlist, user: JwtPayload) => {
  if (!payload.product || !user.id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid input data");
  }
  const existingWishlist = await Wishlist.findOne({
    user: user.id as string,
    product: payload.product,
  });
  if (existingWishlist) {
    await Wishlist.findByIdAndDelete(existingWishlist._id);
    return true;
  }

  // add wish list
  const addWishList = await Wishlist.create({
    user: user.id,
    product: payload.product,
  });
  if (!addWishList) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to add to wishlist"
    );
  }
  return addWishList;
};

const getAllWishListFromDB = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  try {
    const queryBuilder = new QueryBuilder(
      Wishlist.find({ user: user.id }),
      query
    )
      .search(["product"])
      .filter()
      .sort()
      .paginate()
      .fields()
      .populate(["product user"], {
        path: "product user",
        select:
          "_id user name description productImage condition brand size material colors price status isBlocked isDeleted createdAt updatedAt email profile role",
      });

    const result = await queryBuilder.modelQuery;
    const paginationInfo = await queryBuilder.getPaginationInfo();

    if (!result) {
      return [];
    }

    return {
      data: result,
      pagination: paginationInfo,
    };
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Can't find any Data"
    );
  }
};

export const WishlistServices = {
  createWishListIntoDB,
  getAllWishListFromDB,
};
