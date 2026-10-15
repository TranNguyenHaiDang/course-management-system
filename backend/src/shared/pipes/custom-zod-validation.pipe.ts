import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

export class CustomZodValidationPipe implements PipeTransform {
  constructor(private schema: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => {
          const path = err.path.join('.');
          return path ? `${path}: ${err.message}` : err.message;
        });
        throw new BadRequestException({
          statusCode: 400,
          message: errorMessages,
          error: 'Bad Request',
        });
      }
      throw new BadRequestException('Dữ liệu đầu vào không hợp lệ');
    }
  }
}
