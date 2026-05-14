import { Action, createReducer, on } from '@ngrx/store';

import { CourseItemBo } from '../bo/course-item.bo';
import { CourseStatusEnum } from './enums/course-status.enum';
import { CourseActions } from './courses.action';

export const COURSE_KEY = 'coursesKey';

export interface CoursesState {
  readonly [COURSE_KEY]: CourseItemBo[];
  readonly status: CourseStatusEnum;
  readonly error: Error | null;
}

const initialCoursesState: CoursesState = {
  status: CourseStatusEnum.pending,
  [COURSE_KEY]: [],
  error: null,
};

export const coursesReducers = createReducer<CoursesState, Action>(
  initialCoursesState,

  on(CourseActions.loadAllCourses, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.loading,
    };
  }),
  on(CourseActions.loadAllCoursesSuccess, (state, { courses }) => {
    return {
      ...state,
      [COURSE_KEY]: courses,
      status: CourseStatusEnum.loadSuccess,
    };
  }),
  on(CourseActions.loadAllCoursesFailure, (state, { error }) => {
    return {
      ...state,
      status: CourseStatusEnum.loadError,
      error,
    };
  }),


  on(CourseActions.loadFilteredCourses, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.loading,
    };
  }),
  on(CourseActions.loadFilteredCoursesSuccess, (state, { courses }) => {
    return {
      ...state,
      [COURSE_KEY]: courses,
      status: CourseStatusEnum.loadFilteredSuccess,
    };
  }),
  on(CourseActions.loadFilteredCoursesFailure, (state, { error }) => {
    return {
      ...state,
      status: CourseStatusEnum.loadError,
      error,
    };
  }),


  on(CourseActions.loadCoursesByMajor, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.loading,
    };
  }),
  on(CourseActions.loadCoursesByMajorSuccess, (state, { courses }) => {
    return {
      ...state,
      [COURSE_KEY]: courses,
      status: CourseStatusEnum.loadSuccess,
    };
  }),
  on(CourseActions.loadCoursesByMajorFailure, (state, { error }) => {
    return {
      ...state,
      status: CourseStatusEnum.loadError,
      error,
    };
  }),

  on(CourseActions.loadMyMajorCourses, (state) => ({
    ...state,
    status: CourseStatusEnum.loading,
  })),

  on(CourseActions.loadMyMajorCoursesSuccess, (state, { courses }) => ({
    ...state,
    [COURSE_KEY]: courses,
    status: CourseStatusEnum.loadSuccess,
  })),
  on(CourseActions.loadMyMajorCoursesFailure, (state, { error }) => ({
    ...state,
    status: CourseStatusEnum.loadError,
    error,
  }))
);
