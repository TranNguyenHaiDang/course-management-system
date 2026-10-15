import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentsRepo } from './enrollments.repo';
import { EnrollmentStatus } from '@prisma/client';
import {
  AlreadyEnrolledError,
  CourseFullCapacityError,
  EnrollmentNotFoundError,
} from './enrollments.error';
import { EnrollCourseInput } from './enrollments.model';

@Injectable()
export class EnrollmentsService {
  constructor(private enrollmentsRepo: EnrollmentsRepo) {}

  async enrollCourse(userId: number, dto: EnrollCourseInput) {
    const course = await this.enrollmentsRepo.findCourseById(dto.courseId);
    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với mã ID #${dto.courseId}`);
    }

    // Điều kiện nghiệp vụ 1: Từ chối nếu đã đăng ký từ trước
    const existingEnrollment = await this.enrollmentsRepo.findUserEnrollment(userId, dto.courseId);
    if (existingEnrollment && existingEnrollment.status === EnrollmentStatus.ENROLLED) {
      throw new AlreadyEnrolledError();
    }

    // Điều kiện nghiệp vụ 2: Từ chối nếu sĩ số đã đầy
    const currentEnrolledCount = await this.enrollmentsRepo.countEnrolled(dto.courseId);
    if (currentEnrolledCount >= course.capacity) {
      throw new CourseFullCapacityError(course.title, course.capacity);
    }

    let enrollment;
    if (existingEnrollment) {
      enrollment = await this.enrollmentsRepo.updateEnrollment(
        existingEnrollment.id,
        EnrollmentStatus.ENROLLED,
        new Date(),
      );
    } else {
      enrollment = await this.enrollmentsRepo.createEnrollment(userId, dto.courseId);
    }

    return {
      message: `Đăng ký khóa học "${course.title}" thành công!`,
      enrollment,
    };
  }

  async getMyEnrollments(userId: number) {
    return this.enrollmentsRepo.findMyEnrollments(userId);
  }

  async cancelEnrollment(userId: number, courseId: number) {
    const enrollment = await this.enrollmentsRepo.findUserEnrollment(userId, courseId);
    if (!enrollment || enrollment.status !== EnrollmentStatus.ENROLLED) {
      throw new EnrollmentNotFoundError();
    }

    await this.enrollmentsRepo.updateEnrollment(enrollment.id, EnrollmentStatus.CANCELLED);

    return {
      message: 'Hủy đăng ký khóa học thành công',
      courseId,
    };
  }
}
