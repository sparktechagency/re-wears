import { z } from 'zod';

const socialSchemaZod = z.object({
  body: z.object({
    facebookUrl: z.string({
      required_error: 'Facebook URL is required',
      invalid_type_error: 'Facebook URL must be a string',
    }),
    instagramUrl: z.string({
      required_error: 'Instagram URL is required',
      invalid_type_error: 'Instagram URL must be a string',
    }),
    tikTokUrl: z.string({
      required_error: 'TikTok URL is required',
      invalid_type_error: 'TikTok URL must be a string',
    }),
    email: z.string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    }),
  }),
});

const socialUpdateSchemaZod = z.object({
  body: z.object({
    facebookUrl: z.string().optional(),
    instagramUrl: z.string().optional(),
    tikTokUrl: z.string().optional(),
    email: z.string().optional(),
  }),
});


export const SocialValidations = {
  socialSchemaZod,
  socialUpdateSchemaZod
};
