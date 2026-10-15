import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class EmailAlreadyExistsError extends BadRequestException {
  constructor(email?: string) {
    super(email ? `Email "${email}" đã được sử dụng. Vui lòng chọn email khác.` : 'Email đã được sử dụng.');
  }
}

export class InvalidCredentialsError extends UnauthorizedException {
  constructor() {
    super('Email hoặc mật khẩu không chính xác');
  }
}

export class InvalidRefreshTokenError extends UnauthorizedException {
  constructor(message = 'Refresh token không hợp lệ hoặc đã hết hạn') {
    super(message);
  }
}

export class UserNotFoundError extends UnauthorizedException {
  constructor() {
    super('Người dùng không tồn tại');
  }
}
