import express from "express";
import { WishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  WishlistController.createWishList
);

router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  WishlistController.getAllWishList
);
router.get(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  WishlistController.getWishListUsingUserIdAndProductId
);

export const WishlistRoutes = router;
