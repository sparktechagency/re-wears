import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SupportRoutes } from "../modules/support/support.route";
const router = express.Router();

const apiRoutes = [
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/supports", route: SupportRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
