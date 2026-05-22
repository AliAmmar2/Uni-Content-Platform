import {
  Action,
  createReducer,
  on
} from '@ngrx/store';

import { MaterialItemBo } from '../bo/material-item.bo';

import { MaterialStatusEnum } from './enums/material-status.enum';
import { MaterialActions } from './material.action';

export const MATERIAL_KEY = 'materialKey';
export const APPROVED_MATERIALS_KEY = 'approvedMaterialsKey';
export const PENDING_MATERIALS_KEY = 'pendingMaterialsKey';

export interface MaterialState {
  readonly [APPROVED_MATERIALS_KEY]: Array<MaterialItemBo>;
  readonly [PENDING_MATERIALS_KEY]: Array<MaterialItemBo>;
  readonly status: MaterialStatusEnum;
  readonly error: Error;
}

const initialMaterialState: MaterialState = {
  status: MaterialStatusEnum.pending,
  [APPROVED_MATERIALS_KEY]: [],
  [PENDING_MATERIALS_KEY]: [],
  error: null
};

export const materialReducers =
  createReducer<MaterialState, Action>(
    initialMaterialState,

    on(
      MaterialActions.loadApprovedMaterialsByCourse,
      (state: MaterialState) => {
        return {
          ...state,
          status: MaterialStatusEnum.loading,
          error: null
        };
      }
    ),

    on(
      MaterialActions.loadApprovedMaterialsByCourseSuccess,
      (state: MaterialState, { materials }) => {
        return {
          ...state,
          [APPROVED_MATERIALS_KEY]: materials,
          status: MaterialStatusEnum.loadSuccess
        };
      }
    ),

    on(
      MaterialActions.loadApprovedMaterialsByCourseFailure,
      (state: MaterialState, { error }) => {
        return {
          ...state,
          status: MaterialStatusEnum.loadError,
          error
        };
      }
    ),

    on(
      MaterialActions.loadPendingMaterialsByCourse,
      (state: MaterialState) => {
        return {
          ...state,
          status: MaterialStatusEnum.loading,
          error: null
        };
      }
    ),

    on(
      MaterialActions.loadPendingMaterialsByCourseSuccess,
      (state: MaterialState, { materials }) => {
        return {
          ...state,
          [PENDING_MATERIALS_KEY]: materials,
          status: MaterialStatusEnum.loadSuccess
        };
      }
    ),

    on(
      MaterialActions.loadPendingMaterialsByCourseFailure,
      (state: MaterialState, { error }) => {
        return {
          ...state,
          status: MaterialStatusEnum.loadError,
          error
        };
      }
    ),

    on(MaterialActions.reviewMaterial, (state) => {
      return {
        ...state,
        status: MaterialStatusEnum.loading,
        error: null
      };
    }),

    on(MaterialActions.reviewMaterialSuccess, (state) => {
      return {
        ...state,
        status: MaterialStatusEnum.reviewSuccess
      };
    }),

    on(MaterialActions.reviewMaterialFailure, (state, { error }) => {
      return {
        ...state,
        status: MaterialStatusEnum.reviewFailure,
        error
      };
    }),

    on(MaterialActions.resetMaterialState, (state) => {
      return {
        ...state,
        status: MaterialStatusEnum.pending,
        error: null
      };
    })
  );
