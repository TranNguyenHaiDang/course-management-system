import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @ActiveUser() - Lấy thông tin user hiện tại từ JWT payload
 * Alias của CurrentUser để tuân theo cấu trúc tham khảo
 */
export const ActiveUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) return null;
    return data ? request.user[data] : request.user;
  },
);
