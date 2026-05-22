import { Action, createReducer, on } from '@ngrx/store';

import { MaterialItemBo } from '../bo/material-item.bo';
import { MaterialActions } from './material.action';
import { MaterialStatusEnum } from './enums/material-status.enum';

export const MATERIAL_DETAILS_KEY = 'materialDetailsKey';

export interface MaterialDetailsState {
  readonly [MATERIAL_DETAILS_KEY]: MaterialItemBo;
  readonly status: MaterialStatusEnum;
  readonly error: Error;
}

const initialMaterialDetailsState: MaterialDetailsState = {
  [MATERIAL_DETAILS_KEY]: null,
  status: MaterialStatusEnum.pending,
  error: null
};

export const materialDetailsReducers =
  createReducer<MaterialDetailsState, Action>(
    initialMaterialDetailsState,

    on(MaterialActions.uploadMaterial, (state) => {
      return {
        ...state,
        status: MaterialStatusEnum.loading,
        error: null
      };
    }),

    on(MaterialActions.uploadMaterialSuccess, (state) => {
      return {
        ...state,
        status: MaterialStatusEnum.uploadSuccess
      };
    }),

    on(MaterialActions.uploadMaterialFailure, (state, { error }) => {
      return {
        ...state,
        status: MaterialStatusEnum.uploadFailure,
        error
      };
    }),

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

    on(MaterialActions.deleteMaterial, (state) => {
      return {
        ...state,
        status: MaterialStatusEnum.loading,
        error: null
      };
    }),

    on(MaterialActions.deleteMaterialSuccess, (state) => {
      return {
        ...state,
        status: MaterialStatusEnum.deleteSuccess
      };
    }),

    on(MaterialActions.deleteMaterialFailure, (state, { error }) => {
      return {
        ...state,
        status: MaterialStatusEnum.deleteFailure,
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
