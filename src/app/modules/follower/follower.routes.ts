import { Router } from "express";
import { followerController } from "./follower.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();
router.patch("/:id", auth(USER_ROLES.USER), followerController.followUser);
// follower routes
router.get("/:id", auth(USER_ROLES.USER), followerController.getAllFollowerBaseOnUser);


export const followerRoutes = router;