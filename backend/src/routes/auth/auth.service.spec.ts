jest.mock('@nestjs/jwt', () => ({
  JwtService: class {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { SharedUserRepo } from '../../shared/repositories/shared-user.repo';
import { HashingService } from '../../shared/services/hashing.service';
import { TokenService } from '../../shared/services/token.service';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from './auth.error';

describe('AuthService (Unit Tests)', () => {
  let service: AuthService;

  const mockSharedUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockHashingService = {
    hash: jest.fn().mockImplementation((val: string) => Promise.resolve(`hashed_${val}`)),
    compare: jest.fn(),
  };

  const mockTokenService = {
    generateTokenPair: jest.fn().mockResolvedValue({
      accessToken: 'mock_access_token_xyz',
      refreshToken: 'mock_refresh_token_abc',
    }),
    verifyRefreshToken: jest.fn().mockResolvedValue({
      sub: 1,
      email: 'test@course.vn',
      role: Role.STUDENT,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SharedUserRepo,
          useValue: mockSharedUserRepo,
        },
        {
          provide: HashingService,
          useValue: mockHashingService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('Đăng ký tài khoản thành công: trả về thông tin user và KHÔNG cấp accessToken', async () => {
      mockSharedUserRepo.findByEmail.mockResolvedValue(null);
      mockHashingService.hash.mockResolvedValue('hashed_Password123!');
      mockSharedUserRepo.create.mockResolvedValue({
        id: 1,
        email: 'newuser@course.vn',
        fullName: 'Nguyễn Văn Mới',
        role: Role.STUDENT,
        phone: null,
        avatar: null,
        createdAt: new Date(),
      });

      const result = await service.register({
        email: 'newuser@course.vn',
        password: 'Password123!',
        fullName: 'Nguyễn Văn Mới',
        role: 'STUDENT',
      });

      expect(result.message).toContain('Đăng ký tài khoản thành công');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('newuser@course.vn');
      expect(result).not.toHaveProperty('accessToken');
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('Đăng ký thất bại khi email đã tồn tại: ném ra EmailAlreadyExistsError', async () => {
      mockSharedUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'exist@course.vn' });

      await expect(
        service.register({
          email: 'exist@course.vn',
          password: 'Password123!',
          fullName: 'Tên Khác',
          role: 'STUDENT',
        }),
      ).rejects.toThrow(EmailAlreadyExistsError);
    });
  });

  describe('login', () => {
    it('Đăng nhập thành công: trả về CẢ accessToken VÀ refreshToken', async () => {
      mockSharedUserRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'admin@course.vn',
        password: 'hashed_CorrectPass123!',
        fullName: 'Admin User',
        role: Role.ADMIN,
        phone: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockHashingService.compare.mockResolvedValue(true);
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'mock_access_token_xyz',
        refreshToken: 'mock_refresh_token_abc',
      });
      mockHashingService.hash.mockResolvedValue('hashed_mock_refresh_token_abc');
      mockSharedUserRepo.updateRefreshToken.mockResolvedValue({});

      const result = await service.login({
        email: 'admin@course.vn',
        password: 'CorrectPass123!',
      });

      expect(result.message).toBe('Đăng nhập thành công');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.accessToken).toBe('mock_access_token_xyz');
      expect(result.refreshToken).toBe('mock_refresh_token_abc');
    });

    it('Đăng nhập thất bại khi sai mật khẩu: ném ra InvalidCredentialsError', async () => {
      mockSharedUserRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'admin@course.vn',
        password: 'hashed_CorrectPass123!',
        role: Role.ADMIN,
      });
      mockHashingService.compare.mockResolvedValue(false);

      await expect(
        service.login({
          email: 'admin@course.vn',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe('refreshTokens', () => {
    it('Làm mới token thành công khi refreshToken hợp lệ: sinh ra cặp token mới', async () => {
      mockTokenService.verifyRefreshToken.mockResolvedValue({
        sub: 1,
        email: 'test@course.vn',
        role: Role.STUDENT,
      });
      mockSharedUserRepo.findById.mockResolvedValue({
        id: 1,
        email: 'test@course.vn',
        role: Role.STUDENT,
        refreshToken: 'hashed_valid_refresh_token',
      });
      mockHashingService.compare.mockResolvedValue(true);
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'new_mock_access_xyz',
        refreshToken: 'new_mock_refresh_abc',
      });
      mockHashingService.hash.mockResolvedValue('hashed_new_mock_refresh_abc');
      mockSharedUserRepo.updateRefreshToken.mockResolvedValue({});

      const result = await service.refreshTokens({
        refreshToken: 'valid_refresh_token',
      });

      expect(result.message).toBe('Làm mới token thành công');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.accessToken).toBe('new_mock_access_xyz');
      expect(result.refreshToken).toBe('new_mock_refresh_abc');
    });

    it('Làm mới token thất bại khi không tìm thấy refreshToken trong DB', async () => {
      mockTokenService.verifyRefreshToken.mockResolvedValue({
        sub: 1,
        email: 'test@course.vn',
        role: Role.STUDENT,
      });
      mockSharedUserRepo.findById.mockResolvedValue({
        id: 1,
        refreshToken: null,
      });

      await expect(
        service.refreshTokens({ refreshToken: 'some_token' }),
      ).rejects.toThrow(InvalidRefreshTokenError);
    });
  });

  describe('logout', () => {
    it('Đăng xuất thành công: xóa refreshToken trong DB', async () => {
      mockSharedUserRepo.updateRefreshToken.mockResolvedValue({});

      const result = await service.logout(1);
      expect(result.message).toBe('Đăng xuất thành công');
      expect(mockSharedUserRepo.updateRefreshToken).toHaveBeenCalledWith(1, null);
    });
  });

  describe('getProfile', () => {
    it('Lấy profile thành công: trả về dữ liệu an toàn của user', async () => {
      mockSharedUserRepo.findById.mockResolvedValue({
        id: 1,
        email: 'user@course.vn',
        fullName: 'Nguyen Van A',
        role: Role.STUDENT,
        _count: { enrollments: 2 },
      });

      const profile = await service.getProfile(1);
      expect(profile.id).toBe(1);
      expect(profile.email).toBe('user@course.vn');
    });

    it('Lấy profile thất bại nếu user không tồn tại: ném ra UserNotFoundError', async () => {
      mockSharedUserRepo.findById.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(UserNotFoundError);
    });
  });
});
