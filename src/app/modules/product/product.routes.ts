import { Router } from "express";
import { productController } from "./product.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getMultipleFilesPath } from "../../../shared/getFilePath";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  async (req, res, next) => {
    try {
      const payload = req.body;
      console.log("payload", payload);
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
        productImage
      };
      req.body = parsedPayload;
      next();
    } catch (error) {
      console.log(error);
      next(error);
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
  // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  productController.getAllProducts
);

router.patch(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  async (req, res, next) => {
    const productImage = getMultipleFilesPath(req.files, "productImage");
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

    const payload = {
      ...req.body,
      colors: parseIfStringArray(req.body.colors),
      sizes: parseIfStringArray(req.body.sizes),
      brands: parseIfStringArray(req.body.brands),
      materials: parseIfStringArray(req.body.materials),
    };

    req.body = productImage ? { ...payload, productImage } : payload;

    next();
  },
  productController.updateProduct
);

export const productRoutes = router;
