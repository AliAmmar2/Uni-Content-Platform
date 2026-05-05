import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STUDENT_DETAILS_KEY, StudentDetailsState } from './student.reducer';

export const selectStudentDetailsFeature = createFeatureSelector<StudentDetailsState>(STUDENT_DETAILS_KEY);
export const selectStudentDetails = createSelector(selectStudentDetailsFeature, (state: StudentDetailsState) => state);

