import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsRepo } from './enrollments.repo';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, EnrollmentsRepo],
  exports: [EnrollmentsService, EnrollmentsRepo],
})
export class EnrollmentsModule {}
