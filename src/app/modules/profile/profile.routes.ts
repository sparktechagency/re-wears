import { Router } from "express";
import { profileController } from "./profile.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();

router.get("/my-orders", auth(USER_ROLES.USER), profileController.getAllMyOrdersFromDB);
router.get("/:userId", profileController.getAllProductBaseOnStatusFromDB);
router.patch("/follow", auth(USER_ROLES.USER), profileController.followUser);

export const profileRoutes = router;