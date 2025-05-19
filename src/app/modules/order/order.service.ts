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


// Get top sellers and buyers based on order count with search and pagination
const getTopSellersAndBuyers = async (query: Record<string, any>) => {
  // Extract query parameters with defaults - change 'type' to 'userType'
  const { userType = "both", searchTerm, page = 1, limit = 5 } = query;

  // Calculate pagination values
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // CASE 1: Handle specific type request - change 'sellers'/'buyers' to 'seller'/'buyer'
  if (userType === "seller" || userType === "buyer") {
    // Determine which field to use based on userType
    const field = userType === "seller" ? "seller" : "buyer";

    // Build the aggregation pipeline
    const pipeline: any[] = [
      // Step 1: Group by seller/buyer and count orders
      {
        $group: {
          _id: `$${field}`,
          totalOrders: { $sum: 1 },
        },
      },

      // Step 2: Add userType field in a separate project stage
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          userType: { $literal: userType },
        },
      },

      // Step 3: Join with users collection to get user details
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
    ];

    // Step 4: Add search filter if search term is provided
    if (searchTerm) {
      pipeline.push({
        $match: {
          $or: [
            { "userDetails.name": { $regex: searchTerm, $options: "i" } },
            { "userDetails.email": { $regex: searchTerm, $options: "i" } },
          ],
        },
      });
    }

    // Step 5: Use $facet to get both data and count in a single query
    pipeline.push({
      $facet: {
        // Get total count for pagination metadata
        metadata: [{ $count: "total" }],
        // Get paginated and sorted data
        data: [
          { $sort: { totalOrders: -1 } },
          { $skip: skip },
          { $limit: limitNumber },
          {
            $project: {
              _id: 1,
              totalOrders: 1,
              userType: 1,
              name: "$userDetails.name",
              email: "$userDetails.email",
              image: "$userDetails.image",
              role: "$userDetails.role",
            },
          },
        ],
      },
    });

    // Execute the aggregation
    const [result] = await Order.aggregate(pipeline);

    // Format and return the response
    return {
      data: result.data || [],
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total: result.metadata[0]?.total || 0,
      },
    };
  }
  // CASE 2: Handle combined results (both sellers and buyers)
  else {
    // Build a pipeline that combines both sellers and buyers
    const pipeline: any[] = [
      // Step 1: First get all sellers with their order counts
      {
        $group: {
          _id: "$seller",
          totalOrders: { $sum: 1 },
        },
      },
      // Add userType in a separate project stage
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          userType: { $literal: "seller" },
        },
      },

      // Step 2: Union with buyers data
      {
        $unionWith: {
          coll: "orders",
          pipeline: [
            {
              $group: {
                _id: "$buyer",
                totalOrders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 1,
                totalOrders: 1,
                userType: { $literal: "buyer" },
              },
            },
          ],
        },
      },

      // Step 3: Join with users collection to get user details
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
    ];

    // Step 4: Add search filter if search term is provided
    if (searchTerm) {
      pipeline.push({
        $match: {
          $or: [
            { "userDetails.name": { $regex: searchTerm, $options: "i" } },
            { "userDetails.email": { $regex: searchTerm, $options: "i" } },
          ],
        },
      });
    }

    // Step 5: Use $facet to get both data and count
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          // Sort combined results by order count
          { $sort: { totalOrders: -1 } },
          // Apply pagination
          { $skip: skip },
          { $limit: limitNumber },
          // Project only needed fields
          {
            $project: {
              _id: 1,
              totalOrders: 1,
              userType: 1,
              name: "$userDetails.name",
              email: "$userDetails.email",
              image: "$userDetails.image",
              role: "$userDetails.role",
            },
          },
        ],
      },
    });

    // Execute the aggregation
    const [result] = await Order.aggregate(pipeline);

    // Format and return the response
    return {
      data: result.data || [],
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total: result.metadata[0]?.total || 0,
      },
    };
  }
};
export const OrderServices = {
  createOrderIntoDB,
  getAllOrderFromDB,
  getTopSellersAndBuyers,
};
