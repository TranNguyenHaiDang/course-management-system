import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EnrollmentStatus } from '@prisma/client';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsRepo } from './enrollments.repo';
import {
  AlreadyEnrolledError,
  CourseFullCapacityError,
  EnrollmentNotFoundError,
} from './enrollments.error';

describe('EnrollmentsService (Unit Tests)', () => {
  let service: EnrollmentsService;

  const mockEnrollmentsRepo = {
    findCourseById: jest.fn(),
    findUserEnrollment: jest.fn(),
    countEnrolled: jest.fn(),
    createEnrollment: jest.fn(),
    updateEnrollment: jest.fn(),
    findMyEnrollments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: EnrollmentsRepo,
          useValue: mockEnrollmentsRepo,
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    jest.clearAllMocks();
  });

  describe('enrollCourse', () => {
    it('Đăng ký khóa học thành công khi thỏa mãn cả 2 điều kiện', async () => {
      mockEnrollmentsRepo.findCourseById.mockResolvedValue({
        id: 1,
        title: 'Khóa học React Native',
        capacity: 10,
      });
      mockEnrollmentsRepo.findUserEnrollment.mockResolvedValue(null);
      mockEnrollmentsRepo.countEnrolled.mockResolvedValue(5);
      mockEnrollmentsRepo.createEnrollment.mockResolvedValue({
        id: 100,
        userId: 1,
        courseId: 1,
        status: EnrollmentStatus.ENROLLED,
      });

      const result = await service.enrollCourse(1, { courseId: 1 });
      expect(result.message).toContain('thành công');
      expect(result.enrollment.id).toBe(100);
    });

    it('Nghiệp vụ 1: Từ chối đăng ký khi học viên đã đăng ký từ trước (AlreadyEnrolledError)', async () => {
      mockEnrollmentsRepo.findCourseById.mockResolvedValue({
        id: 1,
        title: 'Khóa học Đã Đăng Ký',
        capacity: 10,
      });
      mockEnrollmentsRepo.findUserEnrollment.mockResolvedValue({
        id: 50,
        userId: 1,
        courseId: 1,
        status: EnrollmentStatus.ENROLLED,
      });

      await expect(service.enrollCourse(1, { courseId: 1 })).rejects.toThrow(
        AlreadyEnrolledError,
      );
    });

    it('Nghiệp vụ 2: Từ chối đăng ký khi lớp học đã đầy sĩ số (CourseFullCapacityError)', async () => {
      mockEnrollmentsRepo.findCourseById.mockResolvedValue({
        id: 2,
        title: 'Lớp Học Đầy',
        capacity: 2,
      });
      mockEnrollmentsRepo.findUserEnrollment.mockResolvedValue(null);
      mockEnrollmentsRepo.countEnrolled.mockResolvedValue(2); // Đã đủ 2/2

      await expect(service.enrollCourse(1, { courseId: 2 })).rejects.toThrow(
        CourseFullCapacityError,
      );
    });

    it('Báo lỗi 404 khi không tìm thấy khóa học', async () => {
      mockEnrollmentsRepo.findCourseById.mockResolvedValue(null);

      await expect(service.enrollCourse(1, { courseId: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancelEnrollment', () => {
    it('Hủy đăng ký khóa học thành công', async () => {
      mockEnrollmentsRepo.findUserEnrollment.mockResolvedValue({
        id: 10,
        userId: 1,
        courseId: 1,
        status: EnrollmentStatus.ENROLLED,
      });
      mockEnrollmentsRepo.updateEnrollment.mockResolvedValue({});

      const result = await service.cancelEnrollment(1, 1);
      expect(result.message).toBe('Hủy đăng ký khóa học thành công');
      expect(result.courseId).toBe(1);
    });

    it('Ném ra EnrollmentNotFoundError khi chưa từng đăng ký', async () => {
      mockEnrollmentsRepo.findUserEnrollment.mockResolvedValue(null);

      await expect(service.cancelEnrollment(1, 999)).rejects.toThrow(
        EnrollmentNotFoundError,
      );
    });
  });
});
