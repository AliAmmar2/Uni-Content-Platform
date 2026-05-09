import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StudentItemBo } from '../bo/student-item.bo';
import { StudentDetailsBo } from '../bo/student-details.bo';
import { CreateStudentFormGroupInterface } from '../interfaces/create-student-form-group.interface';
import { UpdateStudentFormGroupInterface } from '../interfaces/update-student-form-group.interface';

export const StudentActions = createActionGroup({
  source: 'Student',
  events: {

    'reset Student State': emptyProps(),

    'load Students': emptyProps(),
    'load Students Success': props<{ students: StudentItemBo[] }>(),
    'load Students Failure': props<{ error: Error }>(),

    'load Student Details': props<{ studentId: string }>(),
    'load Student Details Success': props<{ student: StudentDetailsBo }>(),
    'load Student Details Failure': props<{ error: Error }>(),

    'create Student': props<{ student: CreateStudentFormGroupInterface }>(),
    'create Student Success': emptyProps(),
    'create Student Failure': props<{ error: Error }>(),

    'update Student': props<{
      id: string;
      student: UpdateStudentFormGroupInterface;
    }>(),
    'update Student Success': emptyProps(),
    'update Student Failure': props<{ error: Error }>(),

    'delete Student': props<{ id: string }>(),
    'delete Student Success': emptyProps(),
    'delete Student Failure': props<{ error: Error }>(),
  }
});
