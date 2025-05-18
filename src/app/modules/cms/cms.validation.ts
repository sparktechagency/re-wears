import { z } from "zod";
import { CmsType } from "./cms.constants";

const cmsSchema = z.object({
  body: z.object({
    type: z.enum([...Object.values(CmsType)] as [string, ...string[]], {
      required_error: "Type is required",
    }),
    content: z
      .string({
        required_error: "Content is required",
      })
      .optional(),
  }),
});

export const CmsValidations = { cmsSchema };
