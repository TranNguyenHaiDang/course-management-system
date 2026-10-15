import { z } from 'zod';

// Schema chuẩn cho response thành công
export const SuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    message: z.string(),
    data: dataSchema,
  });

// Schema cho response có pagination
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  });

// Schema cho message-only response
export const MessageResponseSchema = z.object({
  message: z.string(),
});

export type MessageResponse = z.infer<typeof MessageResponseSchema>;
