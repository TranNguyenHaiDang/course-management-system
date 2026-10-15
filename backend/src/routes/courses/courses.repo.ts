import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class CoursesRepo {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: string, category?: string) {
    const whereClause: any = { deletedAt: null };

    if (query && query.trim() !== '') {
      const q = query.trim();
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { instructor: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category && category.trim() !== '' && category !== 'Tất cả') {
      whereClause.category = { equals: category.trim(), mode: 'insensitive' };
    }

    return this.prisma.course.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            enrollments: {
              where: { status: 'ENROLLED' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.course.findFirst({
      where: { id, deletedAt: null } as any,
      include: {
        _count: {
          select: {
            enrollments: {
              where: { status: 'ENROLLED' },
            },
          },
        },
      },
    });
  }

  async findUserEnrollment(userId: number, courseId: number) {
    return this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  async create(data: {
    title: string;
    description: string;
    instructor: string;
    price: number;
    capacity: number;
    thumbnail?: string | null;
    category?: string;
  }) {
    return this.prisma.course.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }

  async getCourseEnrollments(courseId: number) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}
