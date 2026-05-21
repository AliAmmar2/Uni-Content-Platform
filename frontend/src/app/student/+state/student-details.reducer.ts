import { Action, createReducer, on } from '@ngrx/store';
import { StudentActions } from './student.action';
import { StudentDetailsStatusEnum } from './enums/student-details-status.enum';
import { StudentDetailsBo } from '../bo/student-details.bo';

export const STUDENT_DETAILS_KEY = 'studentDetailsKey';
export const LOGGED_IN_STUDENT_KEY = 'loggedInStudentKey';

export interface StudentDetailsState {
  readonly [STUDENT_DETAILS_KEY]: StudentDetailsBo;
  readonly [LOGGED_IN_STUDENT_KEY]: StudentDetailsBo;
  readonly status: StudentDetailsStatusEnum;
  readonly error: Error;
}

const initialStudentDetailsState: StudentDetailsState = {
  [STUDENT_DETAILS_KEY]: null,
  [LOGGED_IN_STUDENT_KEY]: null,
  status: StudentDetailsStatusEnum.pending,
  error: null
};

export const studentDetailsReducers = createReducer<StudentDetailsState, Action>(
  initialStudentDetailsState,

  on(StudentActions.resetStudentState, (state: StudentDetailsState) => {
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
      error
    };
  }),

  on(StudentActions.loadMe, (state) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.loading
    };
  }),
  on(StudentActions.loadMeSuccess, (state, { student }) => {
    return {
      ...state,
      [LOGGED_IN_STUDENT_KEY]: student,
      status: StudentDetailsStatusEnum.loadDetailsSuccess
    };
  }),
  on(StudentActions.loadMeFailure, (state, { error }) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.loadFailure,
      error
    };
  }),

  on(StudentActions.createStudent, (state: StudentDetailsState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.pending,
      error: null
    };
  }),
  on(StudentActions.createStudentSuccess, (state: StudentDetailsState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.createSuccess,
      error: null
    };
  }),
  on(StudentActions.createStudentFailure, (state: StudentDetailsState, { error }) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.createFailure,
      error
    };
  }),

  on(StudentActions.updateStudent, (state: StudentDetailsState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.pending,
      error: null
    };
  }),

  on(StudentActions.updateStudentSuccess, (state: StudentDetailsState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.updateSuccess,
      error: null
    };
  }),

  on(StudentActions.updateStudentFailure, (state: StudentDetailsState, { error }) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.updateFailure,
      error
    };
  }),

  on(StudentActions.deleteStudent, (state: StudentDetailsState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.pending,
      error: null
    };
  }),

  on(StudentActions.deleteStudentSuccess, (state: StudentDetailsState) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.deleteSuccess,
      error: null
    };
  }),

  on(StudentActions.deleteStudentFailure, (state: StudentDetailsState, { error }) => {
    return {
      ...state,
      status: StudentDetailsStatusEnum.deleteFailure,
      error
    };
  })
);
