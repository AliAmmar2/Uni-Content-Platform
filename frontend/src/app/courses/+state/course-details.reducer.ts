import { Action, createReducer, on } from '@ngrx/store';

import { CourseDetailsBo } from '../bo/course-details.bo';
import { CoursesStatusEnum } from './enums/courses-status.enum';
import { CourseActions } from './courses.action';

export const COURSE_DETAILS_KEY = 'courseDetailsKey';

export interface CourseDetailsState {
  readonly [COURSE_DETAILS_KEY]: CourseDetailsBo;
  readonly status: CoursesStatusEnum;
  readonly error: Error;
}

const initialCourseDetailsState: CourseDetailsState = {
  [COURSE_DETAILS_KEY]: null,
  status: CoursesStatusEnum.pending,
  error: null,
};

export const courseDetailsReducers = createReducer<CourseDetailsState, Action>(
  initialCourseDetailsState,

  on(CourseActions.loadCourseDetails, (state) => {
    return {
      ...state,
      status: CoursesStatusEnum.loading
    };
  }),
  on(CourseActions.loadCourseDetailsSuccess, (state, { course }) => {
    return {
      ...state,
      [COURSE_DETAILS_KEY]: course,
      status: CoursesStatusEnum.loadDetailsSuccess
    };
  }),
  on(CourseActions.loadCourseDetailsFailure, (state, { error }) => {
    return {
      ...state,
      status: CoursesStatusEnum.loading,
      error
    };
  }),

  on(CourseActions.createCourse, (state) => {
    return {
      ...state,
      status: CoursesStatusEnum.loading
    };
  }),
  on(CourseActions.createCourseSuccess, (state) => {
    return {
      ...state,
      status: CoursesStatusEnum.createSuccess
    };
  }),
  on(CourseActions.createCourseFailure, (state, { error }) => {
    return {
      ...state,
      status: CoursesStatusEnum.createFailure,
      error
    };
  }),

  on(CourseActions.updateCourse, (state) => {
    return {
      ...state,
      status: CoursesStatusEnum.loading
    };
  }),
  on(CourseActions.updateCourseSuccess, (state) => {
    return {
      ...state,
      status: CoursesStatusEnum.updateSuccess
    };
  }),
  on(CourseActions.updateCourseFailure, (state, { error }) => {
    return {
      ...state,
      status: CoursesStatusEnum.updateFailure,
      error
    };
  }),

  on(CourseActions.deleteCourse, (state) => {
    return {
      ...state,
      status: CoursesStatusEnum.loading
    };
  }),
  on(CourseActions.deleteCourseSuccess, (state) => {
    return {
      ...state,
      status: CoursesStatusEnum.deleteSuccess,
      [COURSE_DETAILS_KEY]: null
    };
  }),
  on(CourseActions.deleteCourseFailure, (state, { error }) => {
    return {
      ...state,
      status: CoursesStatusEnum.deleteFailure,
      error
    };
  }),

  on(CourseActions.resetCourseState, (state) => {
    return {
      ...state,
      [COURSE_DETAILS_KEY]: null,
      status: CoursesStatusEnum.pending,
      error: null
    };
  })
);
