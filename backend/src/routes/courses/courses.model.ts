import { z } from 'zod';

// ==========================================
// 1. ZOD INPUT SCHEMAS
// ==========================================

export const CreateCourseInputSchema = z.object({
  title: z
    .string({ required_error: 'Tên khóa học không được để trống' })
    .min(1, 'Tên khóa học không được để trống'),
  description: z
    .string({ required_error: 'Mô tả khóa học không được để trống' })
    .min(1, 'Mô tả khóa học không được để trống'),
  instructor: z
    .string({ required_error: 'Tên giảng viên không được để trống' })
    .min(1, 'Tên giảng viên không được để trống'),
  price: z.coerce
    .number({ invalid_type_error: 'Học phí phải là một số hợp lệ' })
    .min(0, 'Học phí không thể là số âm'),
  capacity: z.coerce
    .number({ invalid_type_error: 'Sĩ số tối đa phải là một số hợp lệ' })
    .min(1, 'Sĩ số tối đa phải lớn hơn hoặc bằng 1'),
  thumbnail: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
  category: z.string().optional().default('Lập trình'),
});

export const UpdateCourseInputSchema = z.object({
  title: z.string().min(1, 'Tên khóa học không được để trống').optional(),
  description: z.string().min(1, 'Mô tả khóa học không được để trống').optional(),
  instructor: z.string().min(1, 'Tên giảng viên không được để trống').optional(),
  price: z.coerce.number().min(0, 'Học phí không thể là số âm').optional(),
  capacity: z.coerce.number().min(1, 'Sĩ số tối đa phải lớn hơn hoặc bằng 1').optional(),
  thumbnail: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
  category: z.string().optional(),
});

export const CourseQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export type CreateCourseInput = z.infer<typeof CreateCourseInputSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseInputSchema>;
export type CourseQueryInput = z.infer<typeof CourseQuerySchema>;

// ==========================================
// 2. ZOD RESPONSE SCHEMAS
// ==========================================

export const CourseResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  instructor: z.string(),
  price: z.number(),
  capacity: z.number(),
  thumbnail: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
  enrolledCount: z.number().optional(),
  availableSpots: z.number().optional(),
  isFull: z.boolean().optional(),
  isUserEnrolled: z.boolean().optional(),
});

export const CourseListResponseSchema = z.array(CourseResponseSchema);

export const CourseMutateResponseSchema = z.object({
  message: z.string(),
  course: CourseResponseSchema,
});

export const DeleteCourseResponseSchema = z.object({
  message: z.string(),
  deletedId: z.number(),
});

export const CourseEnrollmentsResponseSchema = z.object({
  course: z.object({
    id: z.number(),
    title: z.string(),
    instructor: z.string(),
    capacity: z.number(),
    enrolledCount: z.number(),
    availableSpots: z.number(),
  }),
  enrollments: z.array(
    z.object({
      id: z.number(),
      userId: z.number(),
      courseId: z.number(),
      status: z.enum(['ENROLLED', 'CANCELLED']),
      enrolledAt: z.union([z.date(), z.string()]),
      user: z.object({
        id: z.number(),
        fullName: z.string(),
        email: z.string(),
        phone: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
      }),
    }),
  ),
});

export type CourseResponse = z.infer<typeof CourseResponseSchema>;
export type CourseListResponse = z.infer<typeof CourseListResponseSchema>;
export type CourseMutateResponse = z.infer<typeof CourseMutateResponseSchema>;
export type DeleteCourseResponse = z.infer<typeof DeleteCourseResponseSchema>;
export type CourseEnrollmentsResponse = z.infer<typeof CourseEnrollmentsResponseSchema>;
