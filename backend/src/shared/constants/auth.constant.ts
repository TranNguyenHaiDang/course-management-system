export const AUTH_CONSTANTS = {
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_course_management_2026',
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_jwt_key_course_management_2026',
  ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: 10,
} as const;
