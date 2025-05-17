import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { brandSizeMaterialRoutes } from "../modules/brandSizeMaterial/brandSizeMaterial.routes";
<<<<<<< HEAD
import { ColorRoutes } from "../modules/color/color.route";
import { productRoutes } from "../modules/product/product.routes";
import { CategoryRoutes } from "../modules/category/category.route";
import { SubCategoryRoutes } from "../modules/subCategory/subCategory.routes";
import { childSubCategoryRoutes } from "../modules/childSubCategory/childSubCategory.routes";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";
import { MakeAnOfferRoutes } from "../modules/makeanoffer/makeanoffer.route";
=======
>>>>>>> 273d008b8ca7f3d6ac5e37ba16b0f4f44bcffb5e
const router = express.Router();

const apiRoutes = [
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
<<<<<<< HEAD
  { path: "/type", route: brandSizeMaterialRoutes },
  { path: "/color", route: ColorRoutes },
  { path: "/product", route: productRoutes },
  { path: "/category", route: CategoryRoutes },
  { path: "/sub-category", route: SubCategoryRoutes },
  { path: "/child-sub-category", route: childSubCategoryRoutes },
  { path: "/wishlist", route: WishlistRoutes },
  { path: "/offer", route: MakeAnOfferRoutes },
=======
  { path: "/", route: brandSizeMaterialRoutes },
>>>>>>> 273d008b8ca7f3d6ac5e37ba16b0f4f44bcffb5e
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
