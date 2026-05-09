import { Action, createReducer, on } from '@ngrx/store';
import { FacultyItemBo } from '../bo/faculty-item.bo';
import { FacultyStatusEnum } from './enums/faculty-status.enum';
import { FacultyActions } from './faculty.action';

export const FACULTY_DETAILS_KEY = 'facultyDetailsKey';

export interface FacultyDetailsState {
  readonly [FACULTY_DETAILS_KEY]: FacultyItemBo;
  readonly status: FacultyStatusEnum;
  readonly error: Error;
}

const initialFacultyDetailsState: FacultyDetailsState = {
  [FACULTY_DETAILS_KEY]: null,
  status: FacultyStatusEnum.pending,
  error: null
};

export const facultyDetailsReducers = createReducer<FacultyDetailsState, Action>(
  initialFacultyDetailsState,

  on(FacultyActions.updateFaculty, (state) => {
    return {
      ...state,
      status: FacultyStatusEnum.loading
    };
  }),
  on(FacultyActions.updateFacultySuccess, (state) => {
    return {
      ...state,
      status: FacultyStatusEnum.updateSuccess
    };
  }),
  on(FacultyActions.updateFacultyFailure, (state, { error }) => {
    return {
      ...state,
      status: FacultyStatusEnum.updateFailure,
      error: error
    };
  }),

  on(FacultyActions.createFaculty, (state) => {
    return {
      ...state,
      status: FacultyStatusEnum.loading
    };
  }),
  on(FacultyActions.createFacultySuccess, (state) => {
    return {
      ...state,
      status: FacultyStatusEnum.createSuccess
    };
  }),
  on(FacultyActions.createFacultyFailure, (state, { error }) => {
    return {
      ...state,
      status: FacultyStatusEnum.createFailure,
      error: error
    };
  }),

  on(FacultyActions.deleteFaculty, (state) => {
    return {
      ...state,
      status: FacultyStatusEnum.loading
    };
  }),
  on(FacultyActions.deleteFacultySuccess, (state) => {
    return {
      ...state,
      status: FacultyStatusEnum.deleteSuccess
    };
  }),
  on(FacultyActions.deleteFacultyFailure, (state, { error }) => {
    return {
      ...state,
      status: FacultyStatusEnum.deleteFailure,
      error: error
    };
  }),

  on(FacultyActions.resetFacultyState, (state) => {
    return {
      ...state,
      status: FacultyStatusEnum.pending
    };
  })
);
