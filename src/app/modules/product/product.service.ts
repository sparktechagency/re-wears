import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import QueryBuilder from "../../builder/queryBuilder";
import { Wishlist } from "../wishlist/wishlist.model";
import { sendNotifications } from "../../../helpers/notificationsHelper";

const createProduct = async (
  payload: IProduct,
  user: any
): Promise<IProduct> => {
  if (typeof payload.category === "string") {
    try {
      payload.category = JSON.parse(payload.category);
    } catch (e) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid category format");
    }
  }

  // inject the user id into the payload
  payload.user = user.id;

  const createdProduct = await Product.create(payload);
  if (!createdProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create product");
  }
  //@ts-ignore
  const io = global.io;
  if (io) {
    io.emit(`create-product::${createdProduct.user}`, createdProduct);
  }
  const notificationPayload = {
    userId: createdProduct.user,
    title: 'New Message',
    // @ts-ignore
    message: `You have a new message from ${(createdProduct?.user?.lastName || "User")}`,
    type: 'Message Send',
    filePath: 'Product',
  };
  await sendNotifications(notificationPayload as any);
  return createdProduct;
};

const getAllProducts = async (
  query: Record<string, any>
): Promise<{ data: any[]; meta: any }> => {
  const {
    minPrice,
    maxPrice,
    "category.category": categoryName,
    "category.subCategory": subCategoryName,
    "category.childSubCategory": childSubCategoryName,
    ...restQuery
  } = query;

  const priceFilter: any = {};
  if (minPrice) priceFilter.$gte = Number(minPrice);
  if (maxPrice) priceFilter.$lte = Number(maxPrice);

  const filter: any = { status: { $nin: ["Draft", "Hidden"] } };
  if (Object.keys(priceFilter).length > 0) {
    filter.price = priceFilter;
  }

  const queryBuilder = new QueryBuilder<IProduct>(
    Product.find(filter),
    restQuery
  );

  queryBuilder
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate(
      [
        "user",
        "brand",
        "size",
        "material",
        "colors",
        "category.category",
        "category.subCategory",
        "category.childSubCategory",
      ],
      {
        user: "firstName lastName email image",
        brand: "name",
        size: "name",
        material: "name",
        colors: "name code",
        "category.category": "name",
        "category.subCategory": "name",
        "category.childSubCategory": "name",
      }
    );

  // Get product list after query chain
  let products = await queryBuilder.modelQuery;

  // Manual filtering for category/subcategory/childSubCategory name
  if (categoryName || subCategoryName || childSubCategoryName) {
    products = products.filter((product) => {
      const c = product.category || {};
      const matchCategory =
        !categoryName ||
        // @ts-ignore
        (c.category && c.category.name?.toLowerCase() === categoryName.toLowerCase());
      const matchSubCategory =
        !subCategoryName ||
        (c.subCategory &&
          // @ts-ignore
          c.subCategory.name?.toLowerCase() === subCategoryName.toLowerCase());
      const matchChildSubCategory =
        !childSubCategoryName ||
        (c.childSubCategory &&
          // @ts-ignore
          c.childSubCategory.name?.toLowerCase() === childSubCategoryName.toLowerCase());

      return matchCategory && matchSubCategory && matchChildSubCategory;
    });
  }

  // Get pagination (based on filtered result count)
  const pagination = await queryBuilder.getPaginationInfo();

  // Wishlist counts by product ID
  const productIds = products.map((p) => p._id);
  const wishlistCounts = await Wishlist.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: "$product", count: { $sum: 1 } } },
  ]);

  // Convert to map
  const wishlistMap = wishlistCounts.reduce((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {} as Record<string, number>);

  // Add wishlist count to each product
  const dataWithWishlist = products.map((p) => ({
    // @ts-ignore
    ...p.toObject(),
    wishlistCount: wishlistMap[p._id.toString()] || 0,
  }));

  return {
    data: dataWithWishlist,
    meta: {
      ...pagination,
      total: dataWithWishlist.length,
      totalPage: Math.ceil(dataWithWishlist.length / pagination.limit),
    },
  };
};



const getSingleProductIntoDB = async (id: string) => {
  const result = await Product.findById(id).populate("brand").populate("size").populate("material").populate("colors").populate("user").populate("category.category").populate("category.subCategory").populate("category.childSubCategory");
  const favCount = await Wishlist.countDocuments({ product: id });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }
  return { result, favCount };
};

const updateProductFromDB = async (id: string, payload: IProduct) => {
  const result = await Product.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }
  return result;
};


export const productService = {
  createProduct,
  getAllProducts,
  getSingleProductIntoDB,
  updateProductFromDB,
  deleteProductFromDB,
};
