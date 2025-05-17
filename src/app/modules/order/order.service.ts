import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IOrder, OrderModel } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import QueryBuilder from "../../builder/queryBuilder";

const createOrderIntoDB = async (payload: IOrder) => {
  const isExistingOrder = await Order.findOne({ product: payload?.product });
  if (isExistingOrder) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Product duplicate detected");
  }
  const result = await Order.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Can't create order");
  } else {
    await Product.findByIdAndUpdate(payload.product, {
      status: "Reserved",
    });
  }
  return result;
};

const getAllOrderFromDB = async (query: Record<string, any>) => {
  const queryBuilder = new QueryBuilder(Order.find(), query)
    .search(["status"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryBuilder.modelQuery
    .populate({
      path: "buyer seller",
      select: "name email image role",
    })
    .populate("product");
  const pagination = await queryBuilder.getPaginationInfo();
  return { result, pagination };
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrderFromDB,
};
