import { Action, createReducer, on } from '@ngrx/store';
import { FacultyItemBo } from '../bo/faculty-item.bo';
import { FacultyStatusEnum } from './enums/faculty-status.enum';
import { FacultyActions } from './faculty.action';

export const FACULTY_KEY = 'facultyKey';

export interface FacultyState {
  readonly [FACULTY_KEY]: Array<FacultyItemBo>;
  readonly status: FacultyStatusEnum;
  readonly error: Error;
}

const initialFacultyState: FacultyState = {
  status: FacultyStatusEnum.pending,
  [FACULTY_KEY]: null,
  error: null
};

export const facultyReducers = createReducer<FacultyState, Action>(
  initialFacultyState,

  on(FacultyActions.loadFaculties, (state: FacultyState) => {
    return {
      ...state,
      status: FacultyStatusEnum.loading
    };
  }),

  on(FacultyActions.loadFacultiesSuccess, (state: FacultyState, { faculties }) => {
    return {
      ...state,
      [FACULTY_KEY]: faculties,
      status: FacultyStatusEnum.loadSuccess
    };
  }),

  on(FacultyActions.loadFacultiesFailure, (state: FacultyState, { error }) => {
    return {
      ...state,
      status: FacultyStatusEnum.loadError,
      error: error
    };
  })
);
