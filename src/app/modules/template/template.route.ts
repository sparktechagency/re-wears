import express from "express";
import { TemplateController } from "./template.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  TemplateController.createTemplate
);

export const TemplateRoutes = router;
