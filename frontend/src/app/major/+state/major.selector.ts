import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MAJOR_KEY, MajorState } from './major.reducer';
import { MAJOR_DETAILS_KEY, MajorDetailsState } from './major-details.reducer';

export const selectMajorFeature = createFeatureSelector<MajorState>(MAJOR_KEY);
export const selectAllMajors = createSelector(selectMajorFeature, (state: MajorState) => state);

export const selectMajorDetailsFeature = createFeatureSelector<MajorDetailsState>(MAJOR_DETAILS_KEY);
export const selectMajorDetails = createSelector(selectMajorDetailsFeature, (state: MajorDetailsState) => state);
