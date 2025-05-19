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

router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  TemplateController.updateTemplate
);

router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  TemplateController.deleteTemplate
);

export const TemplateRoutes = router;
