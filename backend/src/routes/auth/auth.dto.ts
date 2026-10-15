export {
  RegisterInputSchema,
  LoginInputSchema,
  RefreshTokenInputSchema,
  UserResponseSchema,
  RegisterResponseSchema,
  LoginResponseSchema,
  RefreshTokenResponseSchema,
  LogoutResponseSchema,
  ProfileResponseSchema,
  type RegisterInput,
  type LoginInput,
  type RefreshTokenInput,
  type UserResponse,
  type RegisterResponse,
  type LoginResponse,
  type RefreshTokenResponse,
  type LogoutResponse,
  type ProfileResponse,
} from './auth.model';

// Alias DTOs cho tương thích ngược
export type RegisterDto = import('./auth.model').RegisterInput;
export type LoginDto = import('./auth.model').LoginInput;
export type RefreshTokenDto = import('./auth.model').RefreshTokenInput;
