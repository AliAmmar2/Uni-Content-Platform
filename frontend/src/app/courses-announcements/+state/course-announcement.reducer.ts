import { Action, createReducer, on } from '@ngrx/store';

import { CourseAnnouncementItemBo } from '../bos/course-announcement-item.bo';

import { CourseAnnouncementStatusEnum } from './enums/course-announcement-status.enum';
import { CourseAnnouncementActions } from './courses-announcement.action';

export const COURSE_ANNOUNCEMENT_KEY =
  'courseAnnouncementKey';

export interface CourseAnnouncementsState {
  readonly [COURSE_ANNOUNCEMENT_KEY]:
    CourseAnnouncementItemBo[];

  readonly status: CourseAnnouncementStatusEnum;

  readonly error: Error | null;
}

const initialCourseAnnouncementsState:
  CourseAnnouncementsState = {

  status: CourseAnnouncementStatusEnum.pending,

  [COURSE_ANNOUNCEMENT_KEY]: [],

  error: null
};

export const courseAnnouncementsReducer =
  createReducer<CourseAnnouncementsState, Action>(
    initialCourseAnnouncementsState,

    on(
      CourseAnnouncementActions.loadCourseAnnouncements,
      (state) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.loading,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.loadCourseAnnouncementsSuccess,
      (state, { announcements }) => ({
        ...state,
        [COURSE_ANNOUNCEMENT_KEY]: announcements,
        status: CourseAnnouncementStatusEnum.loadSuccess,
        error: null
      })
    ),

    on(
      CourseAnnouncementActions.loadCourseAnnouncementsFailure,
      (state, { error }) => ({
        ...state,
        status: CourseAnnouncementStatusEnum.loadError,
        error
      })
    )
  );
