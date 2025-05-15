import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { brandSizeMaterialRoutes } from "../modules/brandSizeMaterial/brandSizeMaterial.routes";
const router = express.Router();

const apiRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/", route: brandSizeMaterialRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
