import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STUDENT_DETAILS_KEY, StudentDetailsState } from './student-details.reducer';
import { STUDENT_KEY, StudentState } from './student.reducer';

export const selectStudentDetailsFeature = createFeatureSelector<StudentDetailsState>(STUDENT_DETAILS_KEY);
export const selectStudentDetails = createSelector(selectStudentDetailsFeature, (state: StudentDetailsState) => state);

export const selectStudentFeature = createFeatureSelector<StudentState>(STUDENT_KEY);
export const selectAllStudents = createSelector(selectStudentFeature, (state: StudentState) => state);
