import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FACULTY_KEY, FacultyState } from './faculty.reducer';
import { FACULTY_DETAILS_KEY, FacultyDetailsState } from './faculty-details.reducer';

export const selectFacultyFeature = createFeatureSelector<FacultyState>(FACULTY_KEY);
export const selectAllFaculties = createSelector(selectFacultyFeature, (state: FacultyState) => state);

export const selectFacultyDetailsFeature = createFeatureSelector<FacultyDetailsState>(FACULTY_DETAILS_KEY);
export const selectFacultyDetails = createSelector(selectFacultyDetailsFeature, (state: FacultyDetailsState) => state);
