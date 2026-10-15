import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CoursesRepo } from './courses.repo';

@Module({
  // JwtModule và PrismaService được cung cấp bởi SharedModule (Global)
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepo],
  exports: [CoursesService, CoursesRepo],
})
export class CoursesModule {}
