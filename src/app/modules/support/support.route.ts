import express from "express";
import { SupportController } from "./support.controller";
import validateRequest from "../../middlewares/validateRequest";
import { SupportValidations } from "./support.validation";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  validateRequest(SupportValidations.createSchema),
  SupportController.createSupport
);

// replay support
router.post(
  "/replay",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  SupportController.sendSupportMail
);

router.patch(
  "/:id",
  validateRequest(SupportValidations.updateSchema),
  SupportController.updateSupport
);

router.get("/", SupportController.getAllSupport);

router.get("/overview", SupportController.getSupportOverview);

export const SupportRoutes = router;
