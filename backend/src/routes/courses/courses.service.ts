import { Injectable } from '@nestjs/common';
import { CoursesRepo } from './courses.repo';
import { CourseNotFoundError } from './courses.error';
import { CreateCourseInput, UpdateCourseInput } from './courses.model';

@Injectable()
export class CoursesService {
  constructor(private coursesRepo: CoursesRepo) {}

  async findAll(query?: string, category?: string) {
    const courses = await this.coursesRepo.findAll(query, category);

    return courses.map((course: any) => {
      const enrolledCount = course._count?.enrollments ?? 0;
      const availableSpots = Math.max(0, course.capacity - enrolledCount);
      const isFull = enrolledCount >= course.capacity;

      return {
        ...course,
        enrolledCount,
        availableSpots,
        isFull,
      };
    });
  }

  async findOne(id: number, currentUserId?: number) {
    const course: any = await this.coursesRepo.findById(id);
    if (!course) {
      throw new CourseNotFoundError(id);
    }

    const enrolledCount = course._count?.enrollments ?? 0;
    const availableSpots = Math.max(0, course.capacity - enrolledCount);
    const isFull = enrolledCount >= course.capacity;

    let isUserEnrolled = false;
    if (currentUserId) {
      const userEnrollment = await this.coursesRepo.findUserEnrollment(currentUserId, id);
      isUserEnrolled = userEnrollment?.status === 'ENROLLED';
    }

    return {
      ...course,
      enrolledCount,
      availableSpots,
      isFull,
      isUserEnrolled,
    };
  }

  async create(dto: CreateCourseInput) {
    const course = await this.coursesRepo.create({
      title: dto.title,
      description: dto.description,
      instructor: dto.instructor,
      price: Number(dto.price),
      capacity: Number(dto.capacity),
      thumbnail: dto.thumbnail || null,
      category: dto.category || 'Lập trình',
    });

    return {
      message: 'Tạo khóa học mới thành công',
      course,
    };
  }

  async update(id: number, dto: UpdateCourseInput) {
    const course = await this.coursesRepo.findById(id);
    if (!course) {
      throw new CourseNotFoundError(id);
    }

    const updated = await this.coursesRepo.update(id, {
      ...(dto.title && { title: dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.instructor && { instructor: dto.instructor }),
      ...(dto.price !== undefined && { price: Number(dto.price) }),
      ...(dto.capacity !== undefined && { capacity: Number(dto.capacity) }),
      ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail }),
      ...(dto.category !== undefined && { category: dto.category }),
    });

    return {
      message: 'Cập nhật khóa học thành công',
      course: updated,
    };
  }

  async delete(id: number) {
    const course = await this.coursesRepo.findById(id);
    if (!course) {
      throw new CourseNotFoundError(id);
    }

    await this.coursesRepo.softDelete(id);

    return {
      message: 'Xóa khóa học thành công',
      deletedId: id,
    };
  }

  async getCourseEnrollments(courseId: number) {
    const course: any = await this.coursesRepo.findById(courseId);
    if (!course) {
      throw new CourseNotFoundError(courseId);
    }

    const enrollments = await this.coursesRepo.getCourseEnrollments(courseId);

    return {
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        capacity: course.capacity,
        enrolledCount: course._count?.enrollments ?? 0,
        availableSpots: Math.max(0, course.capacity - (course._count?.enrollments ?? 0)),
      },
      enrollments,
    };
  }
}
