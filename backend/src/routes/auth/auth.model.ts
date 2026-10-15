import { z } from 'zod';

// ==========================================
// 1. ZOD INPUT SCHEMAS
// ==========================================

export const RegisterInputSchema = z.object({
  email: z
    .string({ required_error: 'Email không được để trống' })
    .email('Địa chỉ email không đúng định dạng'),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống' })
    .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự'),
  fullName: z
    .string({ required_error: 'Họ và tên không được để trống' })
    .min(1, 'Họ và tên không được để trống'),
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
  role: z.enum(['STUDENT', 'ADMIN']).optional().default('STUDENT'),
});

export const LoginInputSchema = z.object({
  email: z
    .string({ required_error: 'Email không được để trống' })
    .email('Địa chỉ email không đúng định dạng'),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống' })
    .min(1, 'Mật khẩu không được để trống'),
});

export const RefreshTokenInputSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token không được để trống' })
    .min(1, 'Refresh token không được để trống'),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenInputSchema>;

// ==========================================
// 2. ZOD RESPONSE SCHEMAS
// ==========================================

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.enum(['STUDENT', 'ADMIN']),
  phone: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export const RegisterResponseSchema = z.object({
  message: z.string(),
  user: UserResponseSchema,
});

export const LoginResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const LogoutResponseSchema = z.object({
  message: z.string(),
});

export const ProfileResponseSchema = UserResponseSchema.extend({
  _count: z
    .object({
      enrollments: z.number(),
    })
    .optional(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
