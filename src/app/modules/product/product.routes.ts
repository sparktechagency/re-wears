import { Router } from "express";
import { productController } from "./product.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getMultipleFilesPath } from "../../../shared/getFilePath";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  async (req, res, next) => {
    try {
      const payload = req.body;
      const productImage = getMultipleFilesPath(req.files, "productImage");
      if (!productImage) {
        res.status(400).json({ message: "Product images are required" });
      }

      const parseIfStringArray = (value: any) => {
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
        return value;
      };
      const parsedPayload = {
        ...payload,
        colors: parseIfStringArray(payload.colors),
        sizes: parseIfStringArray(payload.sizes),
        brands: parseIfStringArray(payload.brands),
        materials: parseIfStringArray(payload.materials),
      };
      req.body = {
        productImage,
        ...parsedPayload,
      };
      next();
    } catch (error) {
      res.status(500).json({ message: "Failed to upload Image" });
    }
  },
  productController.createProduct
);





// 
router.get(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  productController.getSingleProduct
);

// 
router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  productController.getAllProducts
);
export const productRoutes = router;
