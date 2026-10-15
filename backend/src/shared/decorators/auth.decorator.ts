import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';

/**
 * @Auth() - Decorator kết hợp JwtAuthGuard + RolesGuard + @Roles()
 * Dùng để bảo vệ route yêu cầu xác thực và phân quyền
 */
export function Auth(...roles: Role[]) {
  if (roles.length === 0) {
    return applyDecorators(UseGuards(JwtAuthGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
}
