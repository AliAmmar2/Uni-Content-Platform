import { Action, createReducer, on } from '@ngrx/store';

import { MajorDetailsBo } from '../bo/major-details.bo';
import { MajorStatusEnum } from './enums/major-status.enum';
import { MajorActions } from './major.action';

export const MAJOR_DETAILS_KEY = 'majorDetailsKey';

export interface MajorDetailsState {
  readonly [MAJOR_DETAILS_KEY]: MajorDetailsBo;
  readonly status: MajorStatusEnum;
  readonly error: Error;
}

const initialMajorDetailsState: MajorDetailsState = {
  [MAJOR_DETAILS_KEY]: null,
  status: MajorStatusEnum.pending,
  error: null
};

export const majorDetailsReducers = createReducer<MajorDetailsState, Action>(
  initialMajorDetailsState,

  on(MajorActions.loadMajorDetails, (state) => {
    return {
      ...state,
      status: MajorStatusEnum.loading
    };
  }),
  on(MajorActions.loadMajorDetailsSuccess, (state, { major }) => {
    return {
      ...state,
      [MAJOR_DETAILS_KEY]: major,
      status: MajorStatusEnum.loadDetailsSuccess
    };
  }),
  on(MajorActions.loadMajorDetailsFailure, (state, { error }) => {
    return {
      ...state,
      status: MajorStatusEnum.loadError,
      error
    };
  }),


  on(MajorActions.createMajor, (state) => {
    return {
      ...state,
      status: MajorStatusEnum.loading
    };
  }),
  on(MajorActions.createMajorSuccess, (state) => {
    return {
      ...state,
      status: MajorStatusEnum.createSuccess
    };
  }),
  on(MajorActions.createMajorFailure, (state, { error }) => {
    return {
      ...state,
      status: MajorStatusEnum.createFailure,
      error
    };
  }),

  on(MajorActions.updateMajor, (state) => {
    return {
      ...state,
      status: MajorStatusEnum.loading
    };
  }),
  on(MajorActions.updateMajorSuccess, (state) => {
    return {
      ...state,
      status: MajorStatusEnum.updateSuccess
    };
  }),
  on(MajorActions.updateMajorFailure, (state, { error }) => {
    return {
      ...state,
      status: MajorStatusEnum.updateFailure,
      error
    };
  }),

  on(MajorActions.deleteMajor, (state) => {
    return {
      ...state,
      status: MajorStatusEnum.loading
    };
  }),
  on(MajorActions.deleteMajorSuccess, (state) => {
    return {
      ...state,
      status: MajorStatusEnum.deleteSuccess
    };
  }),
  on(MajorActions.deleteMajorFailure, (state, { error }) => {
    return {
      ...state,
      status: MajorStatusEnum.deleteFailure,
      error
    };
  }),

  on(MajorActions.resetMajorState, (state) => {
    return {
      ...state,
      [MAJOR_DETAILS_KEY]: null,
      status: MajorStatusEnum.pending,
      error: null
    };
  })
);
