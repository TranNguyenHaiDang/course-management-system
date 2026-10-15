export {
  CreateCourseInputSchema,
  UpdateCourseInputSchema,
  CourseQuerySchema,
  CourseResponseSchema,
  CourseListResponseSchema,
  CourseMutateResponseSchema,
  DeleteCourseResponseSchema,
  CourseEnrollmentsResponseSchema,
  type CreateCourseInput,
  type UpdateCourseInput,
  type CourseQueryInput,
  type CourseResponse,
  type CourseListResponse,
  type CourseMutateResponse,
  type DeleteCourseResponse,
  type CourseEnrollmentsResponse,
} from './courses.model';

export type CreateCourseDto = import('./courses.model').CreateCourseInput;
export type UpdateCourseDto = import('./courses.model').UpdateCourseInput;
