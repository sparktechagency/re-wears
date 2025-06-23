import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.createOrder
);
router.get(
  "/",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getAllOrder
);

// Get top sellers and buyers based on order count
router.get(
  "/users",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getTopSellersAndBuyers
);
// update order
router.patch(
  "/:productId",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.updateOrderByProduct
);

export const OrderRoutes = router;
