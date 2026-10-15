import { z } from 'zod';

// Model dữ liệu người dùng dùng chung
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.enum(['STUDENT', 'ADMIN']),
  phone: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export type UserModel = z.infer<typeof UserSchema>;

// Model khóa học dùng chung
export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  instructorId: z.number(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export type CourseModel = z.infer<typeof CourseSchema>;

// Model đăng ký khóa học dùng chung
export const EnrollmentSchema = z.object({
  id: z.number(),
  userId: z.number(),
  courseId: z.number(),
  status: z.enum(['ENROLLED', 'CANCELLED']),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export type EnrollmentModel = z.infer<typeof EnrollmentSchema>;
