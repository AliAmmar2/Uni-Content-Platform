import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MATERIAL_KEY, MaterialState } from './material.reducer';
import { MATERIAL_DETAILS_KEY, MaterialDetailsState } from './material-details.reducer';

export const selectMaterialFeature = createFeatureSelector<MaterialState>(MATERIAL_KEY);
export const selectAllMaterials = createSelector(selectMaterialFeature, (state: MaterialState) => state);

export const selectMaterialDetailsFeature = createFeatureSelector<MaterialDetailsState>(MATERIAL_DETAILS_KEY);
export const selectMaterialDetails = createSelector(selectMaterialDetailsFeature, (state: MaterialDetailsState) => state);
