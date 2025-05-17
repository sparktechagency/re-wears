import { z } from "zod";
import { SupportPriority, SupportStatus } from "./support.constants";

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

const updateSchema = z.object({
  body: z.object({
    status: z.enum([...Object.values(SupportStatus)] as [string, ...string[]], {
      required_error: "Status is required",
    }),
  }),
});

export const SupportValidations = { createSchema, updateSchema };
