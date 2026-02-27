import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COURSES_KEY, CoursesState } from './courses.reducer';

export const selectCoursesFeature = createFeatureSelector<CoursesState>(COURSES_KEY);
export const selectCourses = createSelector(selectCoursesFeature, (state: CoursesState) => state);
