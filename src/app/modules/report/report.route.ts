import express from "express";
import { ReportController } from "./report.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ReportValidations } from "./report.validation";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

// create report
router.post(
  "/create",
  auth(),
  validateRequest(ReportValidations.createReportZodSchema),
  ReportController.createReport
);
// update report status
router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(ReportValidations.updateReportZodSchema),
  ReportController.updateReportStatus
);
// get all reports
router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  ReportController.getAllReports
);

export const ReportRoutes = router;
