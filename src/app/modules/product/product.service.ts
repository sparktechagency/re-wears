
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import QueryBuilder from "../../builder/queryBuilder";
import { Wishlist } from "../wishlist/wishlist.model";
import { Category } from "../category/category.model";

/**
 * Creates a new product in the database
 * @param {IProduct} payload - The product data to be created
 * @param {any} user - The user creating the product
 * @returns {Promise<IProduct>} The created product
 * @throws {ApiError} If category format is invalid or product creation fails
 */
const createProduct = async (
  payload: IProduct,
  user: any
): Promise<IProduct> => {
  // parse the categoy string to an object
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
  return createdProduct;
};



/**
 * Retrieves a list of products with pagination and filtering
 * @param {Record<string, any>} query - Query parameters for filtering and pagination
 * @returns {Promise<{ data: any[]; meta: any }>} Paginated product list with metadata
 * @throws {ApiError} If product retrieval fails
 */
const getAllProducts = async (
  query: Record<string, any>
): Promise<{ data: any[]; meta: any }> => {
  console.log("query", query);
  const { minPrice, maxPrice, ...restQuery } = query;

  const priceFilter: any = {};
  if (minPrice) priceFilter.$gte = Number(minPrice);
  if (maxPrice) priceFilter.$lte = Number(maxPrice);

  const filter: any = { status: { $nin: ["Draft", "Hidden"] } };
  if (Object.keys(priceFilter).length > 0) {
    filter.price = priceFilter;
  }

  // Handle category name to ID mapping
  const categoryQuery: Record<string, string> = {};

  if (restQuery['category.category']) {
    const category = await Category.findOne({ name: restQuery['category.category'] });
    if (category) categoryQuery['category.category'] = category._id.toString();
    delete restQuery['category.category'];
  }

  if (restQuery['category.subCategory']) {
    const subCategory = await Category.findOne({ name: restQuery['category.subCategory'] });
    if (subCategory) categoryQuery['category.subCategory'] = subCategory._id.toString();
    delete restQuery['category.subCategory'];
  }

  if (restQuery['category.childSubCategory']) {
    const child = await Category.findOne({ name: restQuery['category.childSubCategory'] });
    if (child) categoryQuery['category.childSubCategory'] = child._id.toString();
    delete restQuery['category.childSubCategory'];
  }

  // Add mapped IDs to filter
  Object.assign(restQuery, categoryQuery);

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

  const products = await queryBuilder.modelQuery;
  const pagination = await queryBuilder.getPaginationInfo();

  const productIds = products?.map((p) => p?._id);

  const wishlistCounts = await Wishlist.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: "$product", count: { $sum: 1 } } },
  ]);

  const wishlistMap = wishlistCounts.reduce((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {} as Record<string, number>);

  const dataWithWishlist = products?.map((p) => {
    return {
      ...p?.toObject(),
      wishlistCount: wishlistMap[p?._id.toString()] || 0,
    };
  });

  return {
    data: dataWithWishlist,
    meta: pagination,
  };
};


/**
 * Retrieves a single product by ID with related data
 * @param {string} id - The product ID to retrieve
 * @returns {Promise<{ result: IProduct; favCount: number }>} Product details and favorite count
 * @throws {ApiError} If product is not found
 */


const getSingleProductIntoDB = async (id: string) => {
  const result = await Product.findById(id).populate("brand").populate("size").populate("material").populate("colors").populate("user").populate("category.category").populate("category.subCategory").populate("category.childSubCategory");
  const favCount = await Wishlist.countDocuments({ product: id });
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }
  return { result, favCount };
};

/**
 * Updates an existing product in the database
 * @param {string} id - The ID of the product to update
 * @param {IProduct} payload - The updated product data
 * @returns {Promise<IProduct>} The updated product
 * @throws {ApiError} If product is not found
 */
const updateProductFromDB = async (id: string, payload: IProduct) => {
  const result = await Product.findByIdAndUpdate(id, payload, { new: true });

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
};
