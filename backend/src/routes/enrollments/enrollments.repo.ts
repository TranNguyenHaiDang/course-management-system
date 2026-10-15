import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsRepo {
  constructor(private prisma: PrismaService) {}

  async findCourseById(id: number) {
    return this.prisma.course.findFirst({ where: { id, deletedAt: null } as any });
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

  async countEnrolled(courseId: number) {
    return this.prisma.enrollment.count({
      where: {
        courseId,
        status: EnrollmentStatus.ENROLLED,
      },
    });
  }

  async createEnrollment(userId: number, courseId: number) {
    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        course: true,
      },
    });
  }

  async updateEnrollment(id: number, status: EnrollmentStatus, enrolledAt?: Date) {
    return this.prisma.enrollment.update({
      where: { id },
      data: {
        status,
        ...(enrolledAt && { enrolledAt }),
      },
      include: {
        course: true,
      },
    });
  }

  async findMyEnrollments(userId: number) {
    return this.prisma.enrollment.findMany({
      where: {
        userId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        course: {
          include: {
            _count: {
              select: {
                enrollments: {
                  where: { status: EnrollmentStatus.ENROLLED },
                },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}
