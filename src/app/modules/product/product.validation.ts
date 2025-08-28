import { z } from "zod";

const createProductValidation = {
  body: z.object({
    name: z.string({ required_error: "name is required" }),
    description: z.string({ required_error: "description is required" }),
    images: z.array(z.string({ required_error: "images is required" })),
    condition: z.enum(["LikelyNew", "VeryGood", "Good", "Fair"], {
      required_error: "condition is required",
    }),
    brand: z.string({ required_error: "brand is required" }),
    size: z.string({ required_error: "size is required" }),
    material: z.string({ required_error: "material is required" }).optional(),
    category: z.object(
      {
        category: z.string({ required_error: "category is required" }),
        subCategory: z.string({ required_error: "subCategory is required" }),
        childSubCategory: z.string({
          required_error: "childSubCategory is required",
        }),
      },
      { required_error: "category object is required" }
    ),
    colors: z.array(z.string({ required_error: "colors is required" })),
    price: z.number({ required_error: "price is required" }),
    status: z.enum(["Active", "Reserved", "Sold", "Hidden", "Draft"], {
      required_error: "status is required",
    }),
    isBlocked: z.boolean().optional().default(false),
    isDeleted: z.boolean().optional().default(false),
  }),
};
export const ProductValidation = {
  createProductValidation,
};
