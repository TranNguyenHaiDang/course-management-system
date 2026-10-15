import { z } from 'zod';

// Schema cho pagination request
export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

// Schema cho ID param
export const IdParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'ID phải là số nguyên dương hợp lệ',
    }),
});

export type IdParam = z.infer<typeof IdParamSchema>;
