import { z } from 'zod';
import { CourseResponseSchema } from '../courses/courses.model';

// ==========================================
// 1. ZOD INPUT SCHEMAS
// ==========================================

export const EnrollCourseInputSchema = z.object({
  courseId: z.coerce
    .number({ invalid_type_error: 'Mã khóa học (courseId) phải là một số hợp lệ' })
    .int('Mã khóa học phải là số nguyên')
    .positive('Mã khóa học không hợp lệ'),
});

export type EnrollCourseInput = z.infer<typeof EnrollCourseInputSchema>;

// ==========================================
// 2. ZOD RESPONSE SCHEMAS
// ==========================================

export const EnrollmentItemResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  courseId: z.number(),
  status: z.enum(['ENROLLED', 'CANCELLED']),
  enrolledAt: z.union([z.date(), z.string()]),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
  course: CourseResponseSchema.optional(),
  user: z
    .object({
      id: z.number(),
      fullName: z.string(),
      email: z.string(),
      phone: z.string().nullable().optional(),
      avatar: z.string().nullable().optional(),
    })
    .optional(),
});

export const EnrollSuccessResponseSchema = z.object({
  message: z.string(),
  enrollment: EnrollmentItemResponseSchema,
});

export const MyEnrollmentsListResponseSchema = z.array(EnrollmentItemResponseSchema);

export const CancelEnrollmentResponseSchema = z.object({
  message: z.string(),
  courseId: z.number(),
});

export type EnrollmentItemResponse = z.infer<typeof EnrollmentItemResponseSchema>;
export type EnrollSuccessResponse = z.infer<typeof EnrollSuccessResponseSchema>;
export type MyEnrollmentsListResponse = z.infer<typeof MyEnrollmentsListResponseSchema>;
export type CancelEnrollmentResponse = z.infer<typeof CancelEnrollmentResponseSchema>;
