import express from "express";
import { ColorController } from "./color.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  ColorController.createColor
);
router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  ColorController.getAllColors
);
router.get(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  ColorController.getSingleColor
);
router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  ColorController.updateColor
);
router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  ColorController.deleteColor
);

export const ColorRoutes = router;
