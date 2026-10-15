import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CreateCourseInputSchema,
  UpdateCourseInputSchema,
  CourseListResponseSchema,
  CourseResponseSchema,
  CourseMutateResponseSchema,
  DeleteCourseResponseSchema,
  CourseEnrollmentsResponseSchema,
  type CreateCourseInput,
  type UpdateCourseInput,
} from './courses.model';
import { CustomZodValidationPipe } from '../../shared/pipes/custom-zod-validation.pipe';
import { CustomZod } from '../../shared/interceptors/custom-zod.interceptor';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Controller('courses')
export class CoursesController {
  constructor(
    private coursesService: CoursesService,
    private jwtService: JwtService,
  ) {}

  @Get()
  @CustomZod(CourseListResponseSchema)
  findAll(
    @Query('q') query?: string,
    @Query('category') category?: string,
  ) {
    return this.coursesService.findAll(query, category);
  }

  @Get(':id')
  @CustomZod(CourseResponseSchema)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    let currentUserId: number | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload: any = this.jwtService.decode(token);
        if (payload?.sub) {
          currentUserId = payload.sub;
        }
      } catch (e) {
        // Ignore token decode error for optional user extraction
      }
    }

    return this.coursesService.findOne(id, currentUserId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @CustomZod(CourseMutateResponseSchema)
  create(@Body(new CustomZodValidationPipe(CreateCourseInputSchema)) dto: CreateCourseInput) {
    return this.coursesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @CustomZod(CourseMutateResponseSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new CustomZodValidationPipe(UpdateCourseInputSchema)) dto: UpdateCourseInput,
  ) {
    return this.coursesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @CustomZod(DeleteCourseResponseSchema)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id/enrollments')
  @CustomZod(CourseEnrollmentsResponseSchema)
  getCourseEnrollments(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseEnrollments(id);
  }
}
