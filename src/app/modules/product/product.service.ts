import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import QueryBuilder from "../../builder/queryBuilder";

const createProduct = async (product: IProduct): Promise<IProduct> => {
  const createdProduct = await Product.create(product);
  if (!createdProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create product");
  }
  return createdProduct;
};

const getAllProducts = async (
  query: Record<string, any>
): Promise<{ data: IProduct[]; meta: any }> => {
  const queryBuilder = new QueryBuilder<IProduct>(Product.find(), query);

  queryBuilder
    .search(["name", "description"]) // Searchable fields
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
