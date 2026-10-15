import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import {
  EnrollCourseInputSchema,
  EnrollSuccessResponseSchema,
  MyEnrollmentsListResponseSchema,
  CancelEnrollmentResponseSchema,
  type EnrollCourseInput,
} from './enrollments.model';
import { CustomZodValidationPipe } from '../../shared/pipes/custom-zod-validation.pipe';
import { CustomZod } from '../../shared/interceptors/custom-zod.interceptor';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post()
  @CustomZod(EnrollSuccessResponseSchema)
  enroll(
    @CurrentUser('id') userId: number,
    @Body(new CustomZodValidationPipe(EnrollCourseInputSchema)) dto: EnrollCourseInput,
  ) {
    return this.enrollmentsService.enrollCourse(userId, dto);
  }

  @Get('my-courses')
  @CustomZod(MyEnrollmentsListResponseSchema)
  getMyEnrollments(@CurrentUser('id') userId: number) {
    return this.enrollmentsService.getMyEnrollments(userId);
  }

  @Delete('course/:courseId')
  @CustomZod(CancelEnrollmentResponseSchema)
  cancel(
    @CurrentUser('id') userId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.cancelEnrollment(userId, courseId);
  }
}
