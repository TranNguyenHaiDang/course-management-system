import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { SharedUserRepo } from './repositories/shared-user.repo';
import { AUTH_CONSTANTS } from './constants/auth.constant';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: AUTH_CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN as any },
    }),
  ],
  providers: [PrismaService, HashingService, TokenService, SharedUserRepo],
  exports: [PrismaService, HashingService, TokenService, SharedUserRepo, JwtModule],
})
export class SharedModule {}
