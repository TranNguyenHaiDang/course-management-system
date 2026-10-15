import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONSTANTS } from '../constants/auth.constant';
import { Role } from '@prisma/client';

export interface TokenPayload {
  sub: number;
  email: string;
  role: Role;
}

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email, role: payload.role },
      {
        secret: AUTH_CONSTANTS.JWT_SECRET,
        expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN as any,
      },
    );
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email, role: payload.role },
      {
        secret: AUTH_CONSTANTS.JWT_REFRESH_SECRET,
        expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN as any,
      },
    );
  }

  async generateTokenPair(
    userId: number,
    email: string,
    role: Role,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: AUTH_CONSTANTS.JWT_REFRESH_SECRET,
    });
  }
}
