import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './routes/auth/auth.module';
import { CoursesModule } from './routes/courses/courses.module';
import { EnrollmentsModule } from './routes/enrollments/enrollments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,        // Global module: PrismaService, HashingService, TokenService, SharedUserRepo
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}
