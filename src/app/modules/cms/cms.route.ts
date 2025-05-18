import express from "express";
import { CmsController } from "./cms.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CmsValidations } from "./cms.validation";

const router = express.Router();

router.put(
  "/",
  validateRequest(CmsValidations.cmsSchema),
  CmsController.createOrUpdateCms
);

router.get("/:type", CmsController.getCms);

export const CmsRoutes = router;
