import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ADMIN_KEY, AdminState } from './admin.reducer';
import { ADMIN_DETAILS_KEY, AdminDetailsState } from './admin-details.reducer';

export const selectAdminFeature = createFeatureSelector<AdminState>(ADMIN_KEY);
export const selectAllAdmins = createSelector(selectAdminFeature, (state: AdminState) => state);

export const selectAdminDetailsFeature = createFeatureSelector<AdminDetailsState>(ADMIN_DETAILS_KEY);
export const selectAdminDetails = createSelector(selectAdminDetailsFeature, (state: AdminDetailsState) => state);
