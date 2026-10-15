import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepo } from './auth.repo';
import { GoogleService } from './google.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from '../../shared/guards/roles.guard';

@Module({
  imports: [
    // PassportModule cần cho JWT strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule và PrismaService được cung cấp bởi SharedModule (Global)
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepo, GoogleService, JwtStrategy, RolesGuard],
  exports: [AuthService, AuthRepo, GoogleService, JwtStrategy, PassportModule, RolesGuard],
})
export class AuthModule {}
