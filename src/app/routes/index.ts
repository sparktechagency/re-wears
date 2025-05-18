import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ColorRoutes } from "../modules/color/color.route";
import { productRoutes } from "../modules/product/product.routes";
import { CategoryRoutes } from "../modules/category/category.route";
import { SubCategoryRoutes } from "../modules/subCategory/subCategory.routes";
import { childSubCategoryRoutes } from "../modules/childSubCategory/childSubCategory.routes";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";
import { MakeAnOfferRoutes } from "../modules/makeanoffer/makeanoffer.route";
import { brandSizeMaterialRoutes } from "../modules/brandSizeMaterial/brandSizeMaterial.routes";
import { SupportRoutes } from "../modules/support/support.route";
import { CmsRoutes } from "../modules/cms/cms.route";
import { ChatRoutes } from "../modules/chat/chat.routes";
import { MessageRoutes } from "../modules/message/message.routes";
import { OrderRoutes } from "../modules/order/order.route";
import { ReportRoutes } from "../modules/report/report.route";
const router = express.Router();

const apiRoutes = [
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/type", route: brandSizeMaterialRoutes },
  { path: "/color", route: ColorRoutes },
  { path: "/product", route: productRoutes },
  { path: "/category", route: CategoryRoutes },
  { path: "/sub-category", route: SubCategoryRoutes },
  { path: "/child-sub-category", route: childSubCategoryRoutes },
  { path: "/wishlist", route: WishlistRoutes },
  { path: "/offer", route: MakeAnOfferRoutes },
  { path: "/supports", route: SupportRoutes },
  { path: "/reports", route: ReportRoutes },
  { path: "/cms", route: CmsRoutes },
  // * for create room
  { path: "/room", route: ChatRoutes },
  { path: "/chat", route: MessageRoutes },
  { path: "/order", route: OrderRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
