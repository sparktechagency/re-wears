import { z } from "zod";

const createSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }),
    category: z.string({ required_error: "category is required" }),
    message: z.string({ required_error: "message is required" }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const TemplateValidations = { createSchema, updateSchema };
