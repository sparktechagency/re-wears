import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { childSubCategoryController } from "./childSubCategory.controller";

const router = Router();
router.post(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  childSubCategoryController.createChildSubCategory
);
router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  childSubCategoryController.getAllChildSubCategories
);

router.get("/:id", childSubCategoryController.getSingleChildSubCategory);
router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  childSubCategoryController.updateChildSubCategory
);
router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  childSubCategoryController.deleteChildSubCategory
);

export const childSubCategoryRoutes = router;
