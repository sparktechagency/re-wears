import { z } from "zod";
import { SupportPriority } from "./support.constants";

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    phone: z.string({
      required_error: "Phone is required",
    }),
    subject: z.string({
      required_error: "Subject is required",
    }),
    message: z.string({
      required_error: "Message is required",
    }),
    priority: z.enum(
      [...Object.values(SupportPriority)] as [string, ...string[]],
      {
        required_error: "Priority is required",
      }
    ),
  }),
});

export const SupportValidations = { createSchema };
