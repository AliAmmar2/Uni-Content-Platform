import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APPROVED_MATERIALS_KEY, MATERIAL_KEY, MaterialState, PENDING_MATERIALS_KEY } from './material.reducer';
import { MATERIAL_DETAILS_KEY, MaterialDetailsState } from './material-details.reducer';

export const selectMaterialFeature =
  createFeatureSelector<MaterialState>(MATERIAL_KEY);

export const selectMaterialState =
  createSelector(
    selectMaterialFeature,
    (state: MaterialState) => state
  );

export const selectAllApprovedMaterials =
  createSelector(
    selectMaterialFeature,
    (state: MaterialState) => state[APPROVED_MATERIALS_KEY]
  );

export const selectAllPendingMaterials =
  createSelector(
    selectMaterialFeature,
    (state: MaterialState) => state[PENDING_MATERIALS_KEY]
  );

export const selectMaterialDetailsFeature = createFeatureSelector<MaterialDetailsState>(MATERIAL_DETAILS_KEY);
export const selectMaterialDetails = createSelector(selectMaterialDetailsFeature, (state: MaterialDetailsState) => state);
