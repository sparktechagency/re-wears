import { z } from "zod";

const createSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }),
    category: z.string({ required_error: "category is required" }),
    message: z.string({ required_error: "message is required" }),
  }),
});

export const TemplateValidations = { createSchema };
