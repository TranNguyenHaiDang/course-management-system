import { BadRequestException, NotFoundException } from '@nestjs/common';

export class AlreadyEnrolledError extends BadRequestException {
  constructor() {
    super('Bạn đã đăng ký khóa học này từ trước.');
  }
}

export class CourseFullCapacityError extends BadRequestException {
  constructor(title: string, capacity: number) {
    super(
      `Khóa học "${title}" đã đạt sĩ số tối đa (${capacity}/${capacity} học viên). Không thể đăng ký thêm.`,
    );
  }
}

export class EnrollmentNotFoundError extends NotFoundException {
  constructor(message = 'Bạn chưa đăng ký khóa học này') {
    super(message);
  }
}
