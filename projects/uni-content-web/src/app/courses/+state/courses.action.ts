import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CoursesDetailsBo } from '../bo/courses-details.bo';

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    'rest Student Details Status': emptyProps(),

    'load Courses': props<{ academicYear: number, calendarYear: number }>(),
    'load Courses Success': props<{ courses: CoursesDetailsBo[] }>(),
    'load Courses Failure': props<{ error: Error }>(),
  }
});
