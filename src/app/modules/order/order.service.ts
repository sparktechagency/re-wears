import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IOrder, OrderModel } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import QueryBuilder from "../../builder/queryBuilder";
import { IProduct } from "../product/product.interface";

const createOrderIntoDB = async (payload: IOrder) => {
  const isExistingOrder = await Order.findOne({ product: payload?.product });
  if (isExistingOrder) {
    await Order.findByIdAndUpdate(isExistingOrder._id, payload);
    await Product.findByIdAndUpdate(payload.product, {
      status: "Reserved",
    });
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
      select: "firstName lastName email image role",
    })
    .populate("product");
  const pagination = await queryBuilder.getPaginationInfo();
  return { result, pagination };
};


// Get top sellers and buyers based on order count with search and pagination
const getTopSellersAndBuyers = async (query: Record<string, any>) => {
  const { userType = "both", searchTerm, page = 1, limit = 5 } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const buildPipeline = (type: "seller" | "buyer") => {
    return [
      {
        $group: {
          _id: `$${type}`,
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          userType: { $literal: type },
        },
      },
    ];
  };

  let pipeline: any[] = [];

  if (userType === "seller" || userType === "buyer") {
    pipeline = buildPipeline(userType);
  } else {
    // Combine both seller and buyer pipelines
    pipeline = [
      ...buildPipeline("seller"),
      {
        $unionWith: {
          coll: "orders",
          pipeline: buildPipeline("buyer"),
        },
      },
    ];
  }

  // Join with user info
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        userDetails: { $ne: null }, // ✅ remove entries with no matched user
      },
    }
  );

  // Add search
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { "userDetails.firstName": { $regex: searchTerm, $options: "i" } },
          { "userDetails.lastName": { $regex: searchTerm, $options: "i" } },
          { "userDetails.email": { $regex: searchTerm, $options: "i" } },
        ],
      },
    });
  }

  // Final stage with pagination and total count
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [
        { $sort: { totalOrders: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
        {
          $project: {
            _id: 1,
            totalOrders: 1,
            userType: 1,
            firstName: "$userDetails.firstName",
            lastName: "$userDetails.lastName",
            email: "$userDetails.email",
            image: "$userDetails.image",
            role: "$userDetails.role",
          },
        },
      ],
    },
  });

  const [result] = await Order.aggregate(pipeline);

  return {
    data: result.data || [],
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: result.metadata[0]?.total || 0,
    },
  };
};



// order update
const updateOrderByProductId = async (id: string, payload: Partial<IProduct>) => {
  // Step 1: Update the product
  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updatedProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  // Step 2: Determine the corresponding order status
  let orderStatus: "Reserved" | "Completed" | "Released" | null = null;

  switch (updatedProduct.status) {
    case "Reserved":
      orderStatus = "Reserved";
      break;
    case "Sold":
      orderStatus = "Completed";
      break;
    case "Active":
      orderStatus = "Released";
      break;
    default:
      orderStatus = null;
  }

  // Step 3: Update the matching order
  if (orderStatus) {
    await Order.findOneAndUpdate(
      { product: updatedProduct._id },
      { $set: { status: orderStatus } }
    );
  }

  return updatedProduct;
};
export const OrderServices = {
  createOrderIntoDB,
  getAllOrderFromDB,
  getTopSellersAndBuyers,
  updateOrderByProductId
};
