import { Action, createReducer, on } from '@ngrx/store';
import { StudentActions } from './student.action';
import { StudentDetailsStatusEnum } from './enums/student-details-status.enum';
import { StudentDetailsBo } from '../bo/student-details.bo';

export const STUDENT_DETAILS_KEY = 'studentDetailsKey';

export interface StudentDetailsState {
  readonly [STUDENT_DETAILS_KEY]: StudentDetailsBo;
  readonly status: StudentDetailsStatusEnum;
  readonly error: Error;
}

const initialStudentDetailsState: StudentDetailsState = {
  [STUDENT_DETAILS_KEY]: null,
  status: StudentDetailsStatusEnum.pending,
  error: null
};

export const studentDetailsReducers = createReducer<StudentDetailsState, Action>(initialStudentDetailsState,
  on(StudentActions.restStudentDetailsStatus, (state) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.pending,
      error: null
    };
  }),

  on(StudentActions.loadStudentDetails, (state: StudentDetailsState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.loading,
      error: null
    };
  }),

  on(StudentActions.loadStudentDetailsSuccess, (state: StudentDetailsState, { student }) => {
    return {
      ...state,
      [STUDENT_DETAILS_KEY]: student,
      status: StudentDetailsStatusEnum.loadDetailsSuccess,
      error: null
    };
  }),

  on(StudentActions.loadStudentDetailsFailure, (state: StudentDetailsState, { error }) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.loadDetailsFailure,
      error: error
    };
  }),
);

