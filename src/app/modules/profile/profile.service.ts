
import QueryBuilder from "../../builder/queryBuilder"
import { Order } from "../order/order.model"
import { Product } from "../product/product.model"
import mongoose from "mongoose";
import { Wishlist } from "../wishlist/wishlist.model";
import { Review } from "../review/review.model";
import { User } from "../user/user.model";

const getAllProductsFilterByStatus = async (id: string, query: Record<string, any>) => {

  const queryBuilder = new QueryBuilder(
    Product.find({ user: id }),
    query
  )
    .filter()
    .sort()
    .paginate().populate(["brand", "size", "colors", "material", "user"], {
      brand: 'name',
      size: 'name',
      colors: 'name'
    });

  const data = await queryBuilder.modelQuery;
  const pagination = await queryBuilder.getPaginationInfo();
  const productsWithWishlistCount = await Promise.all(
    data.map(async (product: any) => {
      const count = await Wishlist.countDocuments({ product: product._id });
      return {
        ...product.toObject(),
        wishlistCount: count,
      };
    })
  );

  return { productsWithWishlistCount, pagination };
};


const getAllMyOrdersFromDB = async (id: string, query: Record<string, any>) => {
  const queryBuilder = new QueryBuilder(
    Order.find({
      buyer: new mongoose.Types.ObjectId(id),
      status: 'Reserved', // only show reserved orders
    }),
    query
  )
    .filter()
    .sort()
    .paginate();

  const populatedQuery = queryBuilder.modelQuery.populate([
    { path: "buyer" },
    { path: "seller" },
    {
      path: "product",
      populate: [
        { path: "size", select: "name" },
        { path: "material", select: "name" },
        { path: "colors", select: "name" },
      ],
    },
  ]);

  const orders = await populatedQuery;
  const pagination = await queryBuilder.getPaginationInfo();

  const data = await Promise.all(
    orders.map(async (order: any) => {
      const orderObj = order.toObject();

      // Calculate average rating for each seller
      const sellerRating = await Review.aggregate([
        {
          $match: {
            seller: new mongoose.Types.ObjectId(orderObj.seller._id),
          },
        },
        {
          $group: {
            _id: "$seller",
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      // Inject averageRating into seller object
      const avgRating = sellerRating.length > 0 ? sellerRating[0].averageRating : 0;

      orderObj.seller = {
        ...orderObj.seller,
        averageRating: avgRating,
      };

      return orderObj;
    })
  );

  return {
    data,
    pagination,
  };
};






// TODO: Add follower in user model 
const followUser = async (userId: string, followerId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { followers: followerId },
    },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  return user
}


export const profileService = {
  getAllProductsFilterByStatus,
  getAllMyOrdersFromDB,
  followUser
}