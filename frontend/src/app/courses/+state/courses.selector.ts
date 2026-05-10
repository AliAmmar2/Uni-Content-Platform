import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COURSE_KEY, CoursesState } from './course.reducer';
import { COURSE_DETAILS_KEY, CourseDetailsState } from './course-details.reducer';

export const selectCourseFeature = createFeatureSelector<CoursesState>(COURSE_KEY);
export const selectAllCourses = createSelector(selectCourseFeature, (state: CoursesState) => state);

export const selectCourseDetailsFeature = createFeatureSelector<CourseDetailsState>(COURSE_DETAILS_KEY);
export const selectCourseDetails = createSelector(selectCourseDetailsFeature, (state: CourseDetailsState) => state);
