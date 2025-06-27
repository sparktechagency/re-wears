import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { ReviewController } from "./review.controller";
const router = express.Router();

router.post(
  "/",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ReviewController.createReview
);


// all review
router.get(
  "/:id",
  // auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ReviewController.getAllReview
);


export const ReviewRoutes = router;