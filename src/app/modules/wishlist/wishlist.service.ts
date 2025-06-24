import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IWishlist, WishlistModel } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/queryBuilder";
import { User } from "../user/user.model";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { Product } from "../product/product.model";

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
  const userDetails = await User.findById(user.id);
  const notificationPayload = {
    userId: user.id,
    title: 'New Wishlist',
    // @ts-ignore
    message: `You have a new wishlist from ${(userDetails?.lastName || "User")}`,
    type: 'Wishlist Create',
  };

  await sendNotifications(notificationPayload as any);
  const productDetails = await Product.findById(payload.product).lean();

  //@ts-ignore
  const io = global.io;
  if (io) {
    io.emit(`createWishlist::${productDetails?.user._id}`, notificationPayload);
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

const getWishListBaseOnIdAndProductId = async (
  user: JwtPayload,
  product: string) => {
  const result = await Wishlist.findOne({
    user: user.id,
    product: product,
  });
  if (!result) {
    return null
  }
  return result;
}




export const WishlistServices = {
  createWishListIntoDB,
  getAllWishListFromDB,
  getWishListBaseOnIdAndProductId
};
