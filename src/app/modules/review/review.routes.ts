import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { ReviewController } from "./review.controller";
const router = express.Router();

router.post(
  "/",
  auth(USER_ROLES.USER),
  // validateRequest(ReviewValidation.reviewZodSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rating, ...othersData } = req.body;

      const user = req.user as any;
      if (!user || !user.id) {
        return res
          .status(401)
          .json({ message: "Unauthorized: user not found" });
      }
      req.body = { ...othersData, customer: user.id, rating: Number(rating) };
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Failed to convert string to number" });
    }
  },
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