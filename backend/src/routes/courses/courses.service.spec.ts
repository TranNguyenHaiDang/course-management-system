import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CoursesRepo } from './courses.repo';
import { CourseNotFoundError } from './courses.error';

describe('CoursesService (Unit Tests)', () => {
  let service: CoursesService;

  const mockCoursesRepo = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findUserEnrollment: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    getCourseEnrollments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: CoursesRepo,
          useValue: mockCoursesRepo,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('Lấy danh sách khóa học: tính toán chính xác enrolledCount, availableSpots và isFull', async () => {
      mockCoursesRepo.findAll.mockResolvedValue([
        {
          id: 1,
          title: 'Khóa học React',
          capacity: 10,
          _count: { enrollments: 3 },
        },
        {
          id: 2,
          title: 'Khóa học Flutter',
          capacity: 2,
          _count: { enrollments: 2 },
        },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].availableSpots).toBe(7);
      expect(result[0].isFull).toBe(false);
      expect(result[1].availableSpots).toBe(0);
      expect(result[1].isFull).toBe(true);
    });
  });

  describe('findOne', () => {
    it('Tìm khóa học theo ID thành công', async () => {
      mockCoursesRepo.findById.mockResolvedValue({
        id: 1,
        title: 'Khóa học NestJS',
        capacity: 20,
        _count: { enrollments: 5 },
      });
      mockCoursesRepo.findUserEnrollment.mockResolvedValue(null);

      const result = await service.findOne(1, 10);
      expect(result.id).toBe(1);
      expect(result.enrolledCount).toBe(5);
      expect(result.isUserEnrolled).toBe(false);
    });

    it('Ném ra CourseNotFoundError khi không tìm thấy khóa học', async () => {
      mockCoursesRepo.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(CourseNotFoundError);
    });
  });

  describe('create', () => {
    it('Tạo khóa học mới thành công', async () => {
      mockCoursesRepo.create.mockResolvedValue({
        id: 10,
        title: 'Python AI',
        price: 2000000,
        capacity: 15,
      });

      const result = await service.create({
        title: 'Python AI',
        description: 'Mô tả',
        instructor: 'TS. AI',
        price: 2000000,
        capacity: 15,
        category: 'Lập trình',
      });

      expect(result.message).toBe('Tạo khóa học mới thành công');
      expect(result.course.id).toBe(10);
    });
  });

  describe('delete', () => {
    it('Xóa khóa học thành công', async () => {
      mockCoursesRepo.findById.mockResolvedValue({ id: 1, title: 'Old Course' });
      mockCoursesRepo.softDelete.mockResolvedValue({ id: 1 });

      const result = await service.delete(1);
      expect(result.message).toBe('Xóa khóa học thành công');
      expect(result.deletedId).toBe(1);
    });
  });
});
