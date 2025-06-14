import { Router } from "express"
import { navController } from "./nav.controller"

const router = Router()
router.get("/:categoryId/sub/:subCategoryId/child/:childSubCategoryId", navController.getAllProductBaseOnAllCategory)
router.get("/category", navController.getProductBaseOnCat)



export const navRouter = router