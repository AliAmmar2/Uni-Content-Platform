import { Action, createReducer, on } from '@ngrx/store';
import { AdminStatusEnum } from './enums/admin-status.enum';
import { AdminActions } from './admin.action';
import { AdminDetailsBo } from '../bo/admin-details.bo';

export const ADMIN_DETAILS_KEY = 'adminDetailsKey';

export interface AdminDetailsState {
  readonly [ADMIN_DETAILS_KEY]: AdminDetailsBo;
  readonly status: AdminStatusEnum;
  readonly error: Error;
}

const initialAdminDetailsState: AdminDetailsState = {
  [ADMIN_DETAILS_KEY]: null,
  status: AdminStatusEnum.pending,
  error: null
};

export const adminDetailsReducers = createReducer<AdminDetailsState, Action>(
  initialAdminDetailsState,
  on(AdminActions.loadAdminDetails, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.loading
    };
  }),
  on(AdminActions.loadAdminDetailsSuccess, (state, { admin }) => {
    return {
      ...state,
      [ADMIN_DETAILS_KEY]: admin,
      status: AdminStatusEnum.loadDetailsSuccess
    };
  }),
  on(AdminActions.loadAdminDetailsFailure, (state, { error }) => {
    return {
      ...state,
      status: AdminStatusEnum.loadError,
      error
    };
  }),

  on(AdminActions.loadMe, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.loading
    };
  }),
  on(AdminActions.loadMeSuccess, (state, { admin }) => {
    return {
      ...state,
      [ADMIN_DETAILS_KEY]: admin,
      status: AdminStatusEnum.loadDetailsSuccess
    };
  }),
  on(AdminActions.loadMeFailure, (state, { error }) => {
    return {
      ...state,
      status: AdminStatusEnum.loadError,
      error
    };
  }),


  on(AdminActions.updateAdmin, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.loading
    };
  }),
  on(AdminActions.updateAdminSuccess, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.updateSuccess
    };
  }),
  on(AdminActions.updateAdminFailure, (state, { error }) => {
    return {
      ...state,
      status: AdminStatusEnum.updateFailure,
      error: error
    };
  }),

  on(AdminActions.createAdmin, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.loading
    };
  }),
  on(AdminActions.createAdminSuccess, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.createSuccess
    };
  }),
  on(AdminActions.createAdminFailure, (state, { error }) => {
    return {
      ...state,
      status: AdminStatusEnum.createFailure,
      error: error
    };
  }),

  on(AdminActions.deleteAdmin, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.loading
    };
  }),
  on(AdminActions.deleteAdminSuccess, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.deleteSuccess
    };
  }),
  on(AdminActions.deleteAdminFailure, (state, { error }) => {
    return {
      ...state,
      status: AdminStatusEnum.deleteFailure,
      error: error
    };
  }),

  on(AdminActions.resetAdminState, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.pending
    };
  })
);
