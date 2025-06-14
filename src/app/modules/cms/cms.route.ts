import express from "express";
import { CmsController } from "./cms.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CmsValidations } from "./cms.validation";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.put(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(CmsValidations.cmsSchema),
  CmsController.createOrUpdateCms
);
// get all cms
router.get("/:type", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), CmsController.getCms);

export const CmsRoutes = router;
