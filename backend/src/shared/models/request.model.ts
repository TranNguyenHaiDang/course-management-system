import { z } from 'zod';

// Zod schema cho pagination request params
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type PaginationModel = z.infer<typeof PaginationSchema>;

// Zod schema cho sort request
export const SortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type SortModel = z.infer<typeof SortSchema>;
