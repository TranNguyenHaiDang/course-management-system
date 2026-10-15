import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterInputSchema,
  LoginInputSchema,
  RefreshTokenInputSchema,
  RegisterResponseSchema,
  LoginResponseSchema,
  RefreshTokenResponseSchema,
  LogoutResponseSchema,
  ProfileResponseSchema,
  type RegisterInput,
  type LoginInput,
  type RefreshTokenInput,
} from './auth.model';
import { CustomZodValidationPipe } from '../../shared/pipes/custom-zod-validation.pipe';
import { CustomZod } from '../../shared/interceptors/custom-zod.interceptor';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @CustomZod(RegisterResponseSchema)
  register(@Body(new CustomZodValidationPipe(RegisterInputSchema)) dto: RegisterInput) {
    return this.authService.register(dto);
  }

  @Post('login')
  @CustomZod(LoginResponseSchema)
  login(@Body(new CustomZodValidationPipe(LoginInputSchema)) dto: LoginInput) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @CustomZod(RefreshTokenResponseSchema)
  refresh(@Body(new CustomZodValidationPipe(RefreshTokenInputSchema)) dto: RefreshTokenInput) {
    return this.authService.refreshTokens(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @CustomZod(LogoutResponseSchema)
  logout(@CurrentUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @CustomZod(ProfileResponseSchema)
  getProfile(@CurrentUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @CustomZod(ProfileResponseSchema)
  getMe(@CurrentUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }
}
