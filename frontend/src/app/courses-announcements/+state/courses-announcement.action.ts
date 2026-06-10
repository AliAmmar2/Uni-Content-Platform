import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CourseAnnouncementItemBo } from '../bos/course-announcement-item.bo';

import {
  CreateCourseAnnouncementFormGroupInterface
} from '../interfaces/create-course-announcement-form-group.interface';

import {
  UpdateCourseAnnouncementFormGroupInterface
} from '../interfaces/update-course-announcement-form-group.interface';

export const CourseAnnouncementActions = createActionGroup({
  source: 'Course Announcement',
  events: {

    'reset Course Announcement State': emptyProps(),

    'load Course Announcement Details': props<{
      announcementId: string;
    }>(),

    'load Course Announcement Details Success': props<{
      announcement: CourseAnnouncementItemBo;
    }>(),

    'load Course Announcement Details Failure': props<{
      error: Error;
    }>(),

    'load Course Announcements': props<{
      courseId: string
    }>(),

    'load Course Announcements Success': props<{
      announcements: CourseAnnouncementItemBo[]
    }>(),

    'load Course Announcements Failure': props<{
      error: Error
    }>(),

    'create Course Announcement': props<{
      announcement: CreateCourseAnnouncementFormGroupInterface
    }>(),

    'create Course Announcement Success': emptyProps(),

    'create Course Announcement Failure': props<{
      error: Error
    }>(),

    'update Course Announcement': props<{
      announcementId: string;
      courseId: string;
      announcement: UpdateCourseAnnouncementFormGroupInterface;
    }>(),

    'update Course Announcement Success': emptyProps(),

    'update Course Announcement Failure': props<{
      error: Error
    }>(),


    'delete Course Announcement': props<{
      announcementId: string;
      courseId: string;
    }>(),

    'delete Course Announcement Success': emptyProps(),

    'delete Course Announcement Failure': props<{
      error: Error
    }>()
  }
});
