import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { SharedUserRepo } from '../../shared/repositories/shared-user.repo';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from './auth.error';
import { RegisterInput, LoginInput, RefreshTokenInput } from './auth.model';
import { HashingService } from '../../shared/services/hashing.service';
import { TokenService } from '../../shared/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private sharedUserRepo: SharedUserRepo,
    private hashingService: HashingService,
    private tokenService: TokenService,
  ) {}

  async register(dto: RegisterInput) {
    const existing = await this.sharedUserRepo.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyExistsError(dto.email);
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const user = await this.sharedUserRepo.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      phone: dto.phone,
      role: (dto.role as Role) || Role.STUDENT,
    });

    return {
      message: 'Đăng ký tài khoản thành công. Vui lòng đăng nhập để tiếp tục.',
      user,
    };
  }

  async login(dto: LoginInput) {
    const user = await this.sharedUserRepo.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await this.hashingService.compare(dto.password, user.password);
    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    const tokens = await this.tokenService.generateTokenPair(user.id, user.email, user.role);
    const hashed = await this.hashingService.hash(tokens.refreshToken);
    await this.sharedUserRepo.updateRefreshToken(user.id, hashed);

    return {
      message: 'Đăng nhập thành công',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshTokens(dto: RefreshTokenInput) {
    try {
      const payload = await this.tokenService.verifyRefreshToken(dto.refreshToken);

      const user = await this.sharedUserRepo.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new InvalidRefreshTokenError('Phiên đăng nhập không hợp lệ hoặc đã bị hủy');
      }

      const isMatch = await this.hashingService.compare(dto.refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new InvalidRefreshTokenError('Refresh token không hợp lệ hoặc đã hết hạn');
      }

      const tokens = await this.tokenService.generateTokenPair(user.id, user.email, user.role);
      const hashed = await this.hashingService.hash(tokens.refreshToken);
      await this.sharedUserRepo.updateRefreshToken(user.id, hashed);

      return {
        message: 'Làm mới token thành công',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof InvalidRefreshTokenError) throw error;
      throw new InvalidRefreshTokenError();
    }
  }

  async logout(userId: number) {
    await this.sharedUserRepo.updateRefreshToken(userId, null);
    return {
      message: 'Đăng xuất thành công',
    };
  }

  async getProfile(userId: number) {
    const user = await this.sharedUserRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}
