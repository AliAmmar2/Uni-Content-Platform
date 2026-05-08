import { Action, createReducer, on } from '@ngrx/store';
import { StudentItemBo } from '../bo/student-item.bo';
import { StudentDetailsStatusEnum } from './enums/student-details-status.enum';
import { StudentActions } from './student.action';

export const STUDENT_KEY = 'studentKey';

export interface StudentState {
  readonly [STUDENT_KEY]: Array<StudentItemBo>;
  readonly status: StudentDetailsStatusEnum;
  readonly error: Error;
}

const initialStudentState: StudentState = {
  status: StudentDetailsStatusEnum.pending,
  [STUDENT_KEY]: [],
  error: null
};

export const studentReducers = createReducer<StudentState, Action>(
  initialStudentState,

  on(StudentActions.loadStudents, (state: StudentState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.loading
    };
  }),

  on(StudentActions.loadStudentsSuccess, (state: StudentState, { students }) => {
    return {
      ...state,
      [STUDENT_KEY]: students,
      status: StudentDetailsStatusEnum.loadSuccess
    };
  }),

  on(StudentActions.loadStudentsFailure, (state: StudentState, { error }) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.loadFailure,
      error: error
    };
  })
);
