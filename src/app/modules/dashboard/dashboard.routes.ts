import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { dashboardController } from "./dashboard.controller";

const router = Router();

router.get("/statestic", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), dashboardController.getTotalUserProductRevenueFromDB);
router.get("/user-growth", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), dashboardController.getUserGrowth);
router.get("/logged-in-product-sold-items", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), dashboardController.getLoggedInProductSoldItems);
router.get("/trending-categories", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), dashboardController.getTrendingCategories);

router.get("/active-users", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), dashboardController.getActiveUsers);

export const dashboardRoutes = router;
