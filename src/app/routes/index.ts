import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { brandSizeMaterialRoutes } from "../modules/brandSizeMaterial/brandSizeMaterial.routes";
const router = express.Router();

const apiRoutes = [
<<<<<<< HEAD
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
=======
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/", route: brandSizeMaterialRoutes },
>>>>>>> 9de4b83b5c2cabf9652f8ca2264520f8f170c84e
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
