
import QueryBuilder from "../../builder/queryBuilder"
import { Order } from "../order/order.model"
import { Product } from "../product/product.model"
import mongoose from "mongoose";
import { Wishlist } from "../wishlist/wishlist.model";

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
  
    const populatedQuery = queryBuilder.modelQuery.populate([
      { path: 'buyer' },
      { path: 'seller' },
      {
        path: 'product',
        populate: [
          { path: 'size', select: 'name' },
          { path: 'material', select: 'name' },
          { path: 'colors', select: 'name' },
        ],
      },
    ]);
  
    const data = await populatedQuery;
    const pagination = await queryBuilder.getPaginationInfo();
  
    return { data, pagination };
  };


export const profileService = {
    getAllProductsFilterByStatus,
    getAllMyOrdersFromDB
}