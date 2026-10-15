import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Role } from '@prisma/client';

/**
 * SharedUserRepo - Dùng chung cho nhiều module (auth, guard, v.v.)
 * Chỉ chứa các query đọc user cơ bản, không có business logic
 */
@Injectable()
export class SharedUserRepo {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return (this.prisma.user as any).findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        avatar: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return (this.prisma.user as any).findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string | null;
    role: Role;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: data.password,
        fullName: data.fullName,
        phone: data.phone ?? null,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    return (this.prisma.user as any).update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
