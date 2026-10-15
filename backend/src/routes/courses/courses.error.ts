import { NotFoundException } from '@nestjs/common';

export class CourseNotFoundError extends NotFoundException {
  constructor(id: number) {
    super(`Không tìm thấy khóa học với mã ID #${id}`);
  }
}
