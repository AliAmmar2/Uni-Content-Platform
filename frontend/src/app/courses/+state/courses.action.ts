import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CourseItemBo } from '../bo/course-item.bo';
import { CourseDetailsBo } from '../bo/course-details.bo';

import { CreateCourseFormGroupInterface } from '../interfaces/create-course-form-group.interface';
import { UpdateCourseFormGroupInterface } from '../interfaces/update-course-form-group.interface';

export const CourseActions = createActionGroup({
  source: 'Course',
  events: {
    'reset Course State': emptyProps(),

    'load Filtered Courses': props<{
      major?: string;
      academicYear?: number;
      calendarYear?: number;
    }>(),
    'load Filtered Courses Success': props<{ courses: CourseItemBo[] }>(),
    'load Filtered Courses Failure': props<{ error: Error }>(),

    'load All Courses': emptyProps(),
    'load All Courses Success': props<{ courses: CourseItemBo[] }>(),
    'load All Courses Failure': props<{ error: Error }>(),

    'load Courses By Major': props<{ majorId: string }>(),
    'load Courses By Major Success': props<{ courses: CourseItemBo[] }>(),
    'load Courses By Major Failure': props<{ error: Error }>(),

    'load My Major Courses': emptyProps(),
    'load My Major Courses Success': props<{ courses: CourseItemBo[] }>(),
    'load My Major Courses Failure': props<{ error: Error }>(),

    'load Course Details': props<{ id: string }>(),
    'load Course Details Success': props<{ course: CourseDetailsBo }>(),
    'load Course Details Failure': props<{ error: Error }>(),

    'create Course': props<{ course: CreateCourseFormGroupInterface }>(),
    'create Course Success': emptyProps(),
    'create Course Failure': props<{ error: Error }>(),

    'update Course': props<{ id: string; course: UpdateCourseFormGroupInterface }>(),
    'update Course Success': emptyProps(),
    'update Course Failure': props<{ error: Error }>(),

    'delete Course': props<{ id: string }>(),
    'delete Course Success': emptyProps(),
    'delete Course Failure': props<{ error: Error }>(),
  }
});
