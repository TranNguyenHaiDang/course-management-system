export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}
