import type { AuthResponse, RegisterResponse, Course, Enrollment, User } from '../types';

const API_BASE = '/api';

class ApiClient {
  private getAccessToken(): string | null {
    return localStorage.getItem('edupro_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('edupro_refresh_token');
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('edupro_token', accessToken);
    localStorage.setItem('edupro_refresh_token', refreshToken);
  }

  private clearTokens() {
    localStorage.removeItem('edupro_token');
    localStorage.removeItem('edupro_refresh_token');
  }

  private isRefreshing = false;

  private async request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
    const token = this.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // Nếu gặp 401 Unauthorized và chưa thử refresh
    if (response.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
      const refreshToken = this.getRefreshToken();
      if (refreshToken && !this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const tokenData = await refreshRes.json();
            this.setTokens(tokenData.accessToken, tokenData.refreshToken);
            this.isRefreshing = false;
            // Retry yêu cầu với accessToken mới
            return this.request<T>(endpoint, options, true);
          }
        } catch (e) {
          console.error('Refresh token failed:', e);
        } finally {
          this.isRefreshing = false;
        }
      }

      // Nếu không thể refresh, xóa token
      this.clearTokens();
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
      throw new Error(errorMessage);
    }

    return data as T;
  }

  // Auth APIs
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.accessToken && res.refreshToken) {
      this.setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  }

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: 'STUDENT' | 'ADMIN';
  }): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      this.clearTokens();
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  // Courses APIs
  async getCourses(query?: string, category?: string): Promise<Course[]> {
    const params = new URLSearchParams();
    if (query && query.trim()) params.append('q', query.trim());
    if (category && category.trim() && category !== 'Tất cả') params.append('category', category.trim());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<Course[]>(`/courses${queryString}`);
  }

  async getCourse(id: number): Promise<Course> {
    return this.request<Course>(`/courses/${id}`);
  }

  async createCourse(data: {
    title: string;
    description: string;
    instructor: string;
    price: number;
    capacity: number;
    thumbnail?: string;
    category?: string;
  }): Promise<{ message: string; course: Course }> {
    return this.request<{ message: string; course: Course }>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      instructor: string;
      price: number;
      capacity: number;
      thumbnail?: string;
      category?: string;
    }>,
  ): Promise<{ message: string; course: Course }> {
    return this.request<{ message: string; course: Course }>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: number): Promise<{ message: string; deletedId: number }> {
    return this.request<{ message: string; deletedId: number }>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  async getCourseEnrollments(
    courseId: number,
  ): Promise<{
    course: {
      id: number;
      title: string;
      instructor: string;
      capacity: number;
      enrolledCount: number;
      availableSpots: number;
    };
    enrollments: Enrollment[];
  }> {
    return this.request(`/courses/${courseId}/enrollments`);
  }

  // Enrollments APIs
  async enroll(courseId: number): Promise<{ message: string; enrollment: Enrollment }> {
    return this.request<{ message: string; enrollment: Enrollment }>('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    return this.request<Enrollment[]>('/enrollments/my-courses');
  }

  async cancelEnrollment(courseId: number): Promise<{ message: string; courseId: number }> {
    return this.request<{ message: string; courseId: number }>(`/enrollments/course/${courseId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
