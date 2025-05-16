import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { brandSizeMaterialRoutes } from "../modules/brandSizeMaterial/brandSizeMaterial.routes";
import { ColorRoutes } from "../modules/color/color.route";
import { productRoutes } from "../modules/product/product.routes";
import { CategoryRoutes } from "../modules/category/category.route";
import { SubCategoryRoutes } from "../modules/subCategory/subCategory.routes";
import { childSubCategoryRoutes } from "../modules/childSubCategory/childSubCategory.routes";
const router = express.Router();

const apiRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/type", route: brandSizeMaterialRoutes },
  { path: "/color", route: ColorRoutes },
  { path: "/product", route: productRoutes },
  { path: "/category", route: CategoryRoutes },
  { path: "/sub-category", route: SubCategoryRoutes },
  { path: "/child-sub-category", route: childSubCategoryRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
