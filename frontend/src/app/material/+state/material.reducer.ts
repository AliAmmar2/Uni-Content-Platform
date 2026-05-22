import {
  Action,
  createReducer,
  on
} from '@ngrx/store';

import { MaterialItemBo } from '../bo/material-item.bo';

import { MaterialStatusEnum } from './enums/material-status.enum';
import { MaterialActions } from './material.action';
import { AdminDetailsState } from '../../portal-admin/+state/admin-details.reducer';

export const MATERIAL_KEY = 'materialKey';

export interface MaterialState {
  readonly [MATERIAL_KEY]: Array<MaterialItemBo>;
  readonly status: MaterialStatusEnum;
  readonly error: Error;
}

const initialMaterialState: MaterialState = {
  status: MaterialStatusEnum.pending,
  [MATERIAL_KEY]: null,
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
          [MATERIAL_KEY]: materials,
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
          [MATERIAL_KEY]: materials,
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
    )
  );
