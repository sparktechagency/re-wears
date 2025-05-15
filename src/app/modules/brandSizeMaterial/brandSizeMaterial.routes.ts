import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { brandSizeMaterialController } from "./brandSizeMaterial.controller";

const router = Router();



router.post("/create", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), brandSizeMaterialController.createBrandSizeMaterial);

router.get("/list/:type", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER), brandSizeMaterialController.getAllBrandSizeMaterial);

router.get("/:type/:id", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER), brandSizeMaterialController.getSingleBrandSizeMaterial);

router.patch("/:type/:id", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), brandSizeMaterialController.updateBrandSizeMaterial);

router.delete("/:type/:id", auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), brandSizeMaterialController.deleteBrandSizeMaterial);

export const brandSizeMaterialRoutes = router;