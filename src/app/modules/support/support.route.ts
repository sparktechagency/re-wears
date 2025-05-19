import express from "express";
import { SupportController } from "./support.controller";
import validateRequest from "../../middlewares/validateRequest";
import { SupportValidations } from "./support.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(SupportValidations.createSchema),
  SupportController.createSupport
);

router.patch(
  "/:id",
  validateRequest(SupportValidations.updateSchema),
  SupportController.updateSupport
);

router.get("/", SupportController.getAllSupport);

router.get("/overview", SupportController.getSupportOverview);

export const SupportRoutes = router;
