export type Role = 'STUDENT' | 'ADMIN';

export type EnrollmentStatus = 'ENROLLED' | 'CANCELLED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  price: number;
  capacity: number;
  thumbnail?: string | null;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
  enrolledCount?: number;
  availableSpots?: number;
  isFull?: boolean;
  isUserEnrolled?: boolean;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  course: Course;
  user?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
  };
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

