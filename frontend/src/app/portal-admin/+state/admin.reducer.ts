import { Action, createReducer, on } from '@ngrx/store';

import { AdminItemBo } from '../bo/admin-item.bo';
import { AdminStatusEnum } from './enums/admin-status.enum';
import { AdminActions } from './admin.action';

export const ADMIN_KEY = 'adminsKey';

export interface AdminState {
  readonly admins: AdminItemBo[];
  readonly status: AdminStatusEnum;
  readonly error: Error | null;
}

const initialAdminState: AdminState = {
  admins: null,
  status: AdminStatusEnum.pending,
  error: null
};

export const adminReducer = createReducer<AdminState, Action>(
  initialAdminState,

  on(AdminActions.loadAdmins, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.loading
    };
  }),

  on(AdminActions.loadAdminsSuccess, (state, { admins }) => {
    return {
      ...state,
      [ADMIN_KEY]: admins,
      status: AdminStatusEnum.loadSuccess
    };
  }),

  on(AdminActions.loadAdminsFailure, (state, { error }) => {
    return {
      ...state,
      status: AdminStatusEnum.loadError,
      error
    };
  }),

  on(AdminActions.resetAdminState, (state) => {
    return {
      ...state,
      status: AdminStatusEnum.pending
    };
  })
);
