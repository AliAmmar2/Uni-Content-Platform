import { Action, createReducer, on } from '@ngrx/store';

import { CourseDetailsBo } from '../bo/course-details.bo';
import { CourseStatusEnum } from './enums/course-status.enum';
import { CourseActions } from './courses.action';

export const COURSE_DETAILS_KEY = 'courseDetailsKey';

export interface CourseDetailsState {
  readonly [COURSE_DETAILS_KEY]: CourseDetailsBo;
  readonly status: CourseStatusEnum;
  readonly error: Error;
}

const initialCourseDetailsState: CourseDetailsState = {
  [COURSE_DETAILS_KEY]: null,
  status: CourseStatusEnum.pending,
  error: null,
};

export const courseDetailsReducers = createReducer<CourseDetailsState, Action>(
  initialCourseDetailsState,

  on(CourseActions.loadCourseDetails, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.loading
    };
  }),
  on(CourseActions.loadCourseDetailsSuccess, (state, { course }) => {
    return {
      ...state,
      [COURSE_DETAILS_KEY]: course,
      status: CourseStatusEnum.loadDetailsSuccess
    };
  }),
  on(CourseActions.loadCourseDetailsFailure, (state, { error }) => {
    return {
      ...state,
      status: CourseStatusEnum.loading,
      error
    };
  }),

  on(CourseActions.createCourse, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.loading
    };
  }),
  on(CourseActions.createCourseSuccess, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.createSuccess
    };
  }),
  on(CourseActions.createCourseFailure, (state, { error }) => {
    return {
      ...state,
      status: CourseStatusEnum.createFailure,
      error
    };
  }),

  on(CourseActions.updateCourse, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.loading
    };
  }),
  on(CourseActions.updateCourseSuccess, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.updateSuccess
    };
  }),
  on(CourseActions.updateCourseFailure, (state, { error }) => {
    return {
      ...state,
      status: CourseStatusEnum.updateFailure,
      error
    };
  }),

  on(CourseActions.deleteCourse, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.loading
    };
  }),
  on(CourseActions.deleteCourseSuccess, (state) => {
    return {
      ...state,
      status: CourseStatusEnum.deleteSuccess,
      [COURSE_DETAILS_KEY]: null
    };
  }),
  on(CourseActions.deleteCourseFailure, (state, { error }) => {
    return {
      ...state,
      status: CourseStatusEnum.deleteFailure,
      error
    };
  }),

  on(CourseActions.resetCourseState, (state) => {
    return {
      ...state,
      [COURSE_DETAILS_KEY]: null,
      status: CourseStatusEnum.pending,
      error: null
    };
  })
);
