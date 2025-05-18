import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import QueryBuilder from "../../builder/queryBuilder";

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

const getAllProducts = async (
  query: Record<string, any>
): Promise<{ data: IProduct[]; meta: any }> => {
  const { minPrice, maxPrice, ...restQuery } = query;
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
        user: "name email",
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

  return {
    data: products,
    meta: pagination,
  };
};

const getSingleProductIntoDB = async (id: string) => {
  const result = await Product.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }
  return result;
};

export const productService = {
  createProduct,
  getAllProducts,
  getSingleProductIntoDB,
};
