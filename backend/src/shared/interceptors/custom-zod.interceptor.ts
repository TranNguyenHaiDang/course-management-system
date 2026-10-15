import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZodError, type ZodType } from 'zod';

@Injectable()
export class CustomZodInterceptor implements NestInterceptor {
  constructor(private schema: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        try {
          return this.schema.parse(data);
        } catch (error) {
          if (error instanceof ZodError) {
            console.error(
              'Lỗi cấu trúc dữ liệu trả về (Custom Zod Interceptor Error):',
              JSON.stringify(error.format(), null, 2),
            );
            throw new InternalServerErrorException(
              'Cấu trúc dữ liệu trả về từ máy chủ không khớp với schema quy định',
            );
          }
          throw error;
        }
      }),
    );
  }
}

export function CustomZod(schema: ZodType<any, any, any>) {
  return UseInterceptors(new CustomZodInterceptor(schema));
}

export function validateResponse<T>(schema: ZodType<T, any, any>, data: unknown): T {
  return schema.parse(data);
}
