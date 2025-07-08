import express from "express";
import { SocialController } from "./social.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { SocialValidations } from "./social.validation";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(SocialValidations.socialSchemaZod),
  SocialController.createSocial
);

router.get(
  "/",
  SocialController.getAllSocial
);

export const SocialRoutes = router;
