import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StudentDetailsBo } from '../bo/student-details.bo';

export const StudentActions = createActionGroup({
  source: 'Student',
  events: {
    'rest Student Details Status': emptyProps(),

    'load Student Details': props<{ studentId: string }>(),
    'load Student Details Success': props<{ student: StudentDetailsBo }>(),
    'load Student Details Failure': props<{ error: Error }>(),
  }
});
