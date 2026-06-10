import { Action, createReducer, on } from '@ngrx/store';

import { CourseAnnouncementItemBo } from '../bos/course-announcement-item.bo';

import { CourseAnnouncementStatusEnum } from './enums/course-announcement-status.enum';
import { CourseAnnouncementActions } from './courses-announcement.action';

export const COURSE_ANNOUNCEMENT_DETAILS_KEY =
  'courseAnnouncementDetailsKey';

export interface CourseAnnouncementDetailsState {

  readonly [COURSE_ANNOUNCEMENT_DETAILS_KEY]:
    CourseAnnouncementItemBo | null;

  readonly status: CourseAnnouncementStatusEnum;

  readonly error: Error | null;
}

const initialCourseAnnouncementDetailsState:
  CourseAnnouncementDetailsState = {

  [COURSE_ANNOUNCEMENT_DETAILS_KEY]: null,

  status: CourseAnnouncementStatusEnum.pending,

  error: null
};

export const courseAnnouncementDetailsReducers =
  createReducer<CourseAnnouncementDetailsState, Action>(
    initialCourseAnnouncementDetailsState,

    on(
      CourseAnnouncementActions.createCourseAnnouncement,
      (state) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.loading,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.createCourseAnnouncementSuccess,
      (state) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.createSuccess,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.createCourseAnnouncementFailure,
      (state, { error }) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.createFailure,
        error
      })
    ),
    on(CourseAnnouncementActions.loadCourseAnnouncementDetails, (state) => ({
      ...state,
      status: CourseAnnouncementStatusEnum.loading,
      error: null
    })),

    on(CourseAnnouncementActions.loadCourseAnnouncementDetailsSuccess, (state, { announcement }) => ({
      ...state,
      [COURSE_ANNOUNCEMENT_DETAILS_KEY]: announcement,
      status: CourseAnnouncementStatusEnum.loadDetailsSuccess,
      error: null
    })),

    on(CourseAnnouncementActions.loadCourseAnnouncementDetailsFailure, (state, { error }) => ({
      ...state,
      status: CourseAnnouncementStatusEnum.loadDetailsFailure,
      error
    })),
    on(
      CourseAnnouncementActions.updateCourseAnnouncement,
      (state) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.loading,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.updateCourseAnnouncementSuccess,
      (state) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.updateSuccess,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.updateCourseAnnouncementFailure,
      (state, { error }) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.updateFailure,
        error
      })
    ),

    on(
      CourseAnnouncementActions.deleteCourseAnnouncement,
      (state) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.loading,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.deleteCourseAnnouncementSuccess,
      (state) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.deleteSuccess,
        [COURSE_ANNOUNCEMENT_DETAILS_KEY]: null,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.deleteCourseAnnouncementFailure,
      (state, { error }) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.deleteFailure,
        error
      })
    ),

    on(
      CourseAnnouncementActions.resetCourseAnnouncementState,
      () => initialCourseAnnouncementDetailsState
    )
  );
