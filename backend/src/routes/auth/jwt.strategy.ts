import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SharedUserRepo } from '../../shared/repositories/shared-user.repo';
import { AUTH_CONSTANTS } from '../../shared/constants/auth.constant';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private sharedUserRepo: SharedUserRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONSTANTS.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.sharedUserRepo.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại hoặc phiên đăng nhập đã hết hạn');
    }

    const { refreshToken: _, ...safeUser } = user as any;
    return safeUser;
  }
}
