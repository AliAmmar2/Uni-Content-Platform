import { Action, createReducer, on } from '@ngrx/store';
import { CoursesActions } from './courses.action';
import { CoursesStatusEnum } from './enums/courses-status.enum';
import { CoursesDetailsBo } from '../bo/courses-details.bo';

export const COURSES_KEY = 'coursesKey';

export interface CoursesState {
  readonly [COURSES_KEY]: CoursesDetailsBo[];
  readonly status: CoursesStatusEnum;
  readonly error: Error;
}

const initialCoursesState: CoursesState = {
  [COURSES_KEY]: [],
  status: CoursesStatusEnum.pending,
  error: null
};
export const coursesReducers = createReducer<CoursesState, Action>(initialCoursesState,
  on(CoursesActions.loadCourses, (state: CoursesState) => {
    return {
      ...state,
      status: CoursesStatusEnum.loading
    };
  }),
  on(CoursesActions.loadCoursesSuccess, (state: CoursesState, { courses }) => {
    return {
      ...state,
      [COURSES_KEY]: courses,
      status: CoursesStatusEnum.loadSuccess
    };
  }),
  on(CoursesActions.loadCoursesFailure, (status: CoursesState, { error }) => {
      return {
        ...status,
        status: CoursesStatusEnum.loadError,
        error: error
      };
    }
  )
);


