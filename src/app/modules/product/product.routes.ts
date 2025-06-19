import { Router } from "express";
import { productController } from "./product.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getMultipleFilesPath } from "../../../shared/getFilePath";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = Router();
// create product route
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
      if (!payload.status) {
        return res.status(400).json({ message: "Status is required" });
      }

      if (!["Active", "Reserved", "Sold", "Hidden", "Draft"].includes(payload.status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed values are: Active, Reserved, Sold, Hidden, Draft. Received: ${payload.status}`
        });
      }
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

// get single product route
router.get(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  productController.getSingleProduct
);

// get all products route
router.get(
  "/",
  // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  productController.getAllProducts
);

// update product route
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
    const data = req.body
    if (!data.status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["Active", "Reserved", "Sold", "Hidden", "Draft"].includes(data.status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: Active, Reserved, Sold, Hidden, Draft. Received: ${data.status}`
      });
    }

    const payload = {
      ...data,
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
