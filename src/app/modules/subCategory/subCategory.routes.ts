import { Router } from "express";
import { SubCategoryController } from "./subCategory.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getSingleFilePath } from "../../../shared/getFilePath";

const router = Router();
router.post(
  "/",
  fileUploadHandler(),
  async (req, res, next) => {
    try {
      const payload = req.body;
      const icon = getSingleFilePath(req.files, "icon");
      if (!icon) {
        return res.status(400).json({ message: "Icon is required." });
      }
      req.body = {
        icon,
        ...payload,
      };
      next();
    } catch (error) {
      res.status(500).json({ message: "Failed to upload Image" });
    }
  },
  // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  SubCategoryController.createSubCategory
);

router.get(
  "/",
  // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  SubCategoryController.getAllSubCategory
);

router.get(
  "/:id",
  // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  SubCategoryController.getSingleSubCategory
);

router.patch(
  "/:id",
  (req, res, next) => {
    fileUploadHandler()(req, res, err => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      const payload = req.body;
      const icon = req.files ? getSingleFilePath(req.files, 'icon') : undefined;

      if (!icon) delete payload.icon;
      else payload.icon = icon;

      req.body = payload;
      next();
    } catch (err) {
      res.status(500).json({ message: 'Failed to upload Image' });
    }
  },
  SubCategoryController.updateSubCategory
);
router.delete(
  "/:id",
  // auth(USER_ROLES.SUPER_ADMIN),
  SubCategoryController.deleteSubCategory
);

export const SubCategoryRoutes = router;
