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
    // category parse
    let category = req.body.category;
    if (typeof category === "string") {
      try {
        category = JSON.parse(category);
      } catch (error) {
        // fallback if parsing fails
      }
    }

    let productImageExist = req.body.productImage || [];
    let arr = []
    if (typeof productImageExist == 'string') {
      arr = [productImageExist]
      productImageExist = arr
    }
    if (typeof productImage == 'string') {
      arr.push(productImage)
    }
    else {
      const mergedImages = [
        ...productImageExist,
        ...(productImage || []),
      ];
      arr = mergedImages
    }
    const payload = {
      ...req.body,
      category,
      colors: parseIfStringArray(req.body.colors),
      sizes: parseIfStringArray(req.body.sizes),
      brands: parseIfStringArray(req.body.brands),
      materials: parseIfStringArray(req.body.materials),
      productImage: arr
    };
    req.body = payload;
    next();
  },
  productController.updateProduct
);

router.patch("/update-status/:id", auth(USER_ROLES.USER), productController.productStatusUpdate);
// delete product
router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  productController.deleteProduct
);




export const productRoutes = router;