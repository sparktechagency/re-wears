import express from "express";
import { MakeAnOfferController } from "./makeanoffer.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.USER),
  MakeAnOfferController.createOffer
);

export const MakeAnOfferRoutes = router;
