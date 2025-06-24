
import QueryBuilder from "../../builder/queryBuilder"
import { Order } from "../order/order.model"
import { Product } from "../product/product.model"
import mongoose from "mongoose";
import { Wishlist } from "../wishlist/wishlist.model";
import { Review } from "../review/review.model";

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
    Order.find({ buyer: new mongoose.Types.ObjectId(id) }),
    query
  )
    .filter()
    .sort()
    .paginate();

  // Populate buyer, seller, and product details
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

  // STEP 1: Get all unique seller IDs
  const sellerIds = orders
    .filter(order => order?.seller?._id)
    .map(order => new mongoose.Types.ObjectId(order.seller._id));

  // STEP 2: Aggregate average rating from Review collection
  const averageRatings = await Review.aggregate([
    {
      $match: {
        buyer: { $in: sellerIds }, // If you're using `seller` field in Review model, replace `buyer` with `seller`
      },
    },
    {
      $group: {
        _id: "$buyer", // Or "$seller" if field renamed
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  // STEP 3: Map sellerId → averageRating
  const ratingMap = new Map(
    averageRatings.map(item => [item._id.toString(), item.averageRating])
  );

  // STEP 4: Inject average rating into seller object
  const enrichedOrders = orders.map(order => {
    const sellerId = order.seller?._id?.toString();
    const avgRating = ratingMap.get(sellerId) || 0;

    return {
      ...order.toObject(),
      seller: {
        ...order.seller.toObject(),
        averageRating: parseFloat(avgRating.toFixed(2)),
      },
    };
  });

  const pagination = await queryBuilder.getPaginationInfo();

  return {
    data: enrichedOrders,
    pagination,
  };
};



export const profileService = {
  getAllProductsFilterByStatus,
  getAllMyOrdersFromDB
}