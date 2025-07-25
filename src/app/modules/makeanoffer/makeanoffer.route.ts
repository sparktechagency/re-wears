import express from "express";
import { MakeAnOfferController } from "./makeanoffer.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MakeAnOfferController.createOffer
);

router.post("/send/:receiverId", auth(USER_ROLES.USER), MakeAnOfferController.getOfferUsingSocket);


router.get(
  "/",
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MakeAnOfferController.getAllOffer
);


router.patch("/:id", auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), MakeAnOfferController.updateOfferStatus);

export const MakeAnOfferRoutes = router;
