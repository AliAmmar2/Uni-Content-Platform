import { Action, createReducer, on } from '@ngrx/store';

import { MajorItemBo } from '../bo/major-item.bo';
import { MajorStatusEnum } from './enums/major-status.enum';
import { MajorActions } from './major.action';


export const MAJOR_KEY = 'majorKey';

export interface MajorState {
  readonly [MAJOR_KEY]: Array<MajorItemBo>;
  readonly status: MajorStatusEnum;
  readonly error: Error;
}

const initialMajorState: MajorState = {
  status: MajorStatusEnum.pending,
  [MAJOR_KEY]: null,
  error: null
};

export const majorReducers = createReducer<MajorState, Action>(
  initialMajorState,

  on(MajorActions.loadMajors, (state: MajorState) => {
    return {
      ...state,
      status: MajorStatusEnum.loading
    };
  }),

  on(MajorActions.loadMajorsSuccess, (state: MajorState, { majors }) => {
    return {
      ...state,
      [MAJOR_KEY]: majors,
      status: MajorStatusEnum.loadSuccess
    };
  }),

  on(MajorActions.loadMajorsFailure, (state: MajorState, { error }) => {
    return {
      ...state,
      status: MajorStatusEnum.loadError,
      error: error
    };
  })
);
