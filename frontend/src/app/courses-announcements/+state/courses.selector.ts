import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COURSE_ANNOUNCEMENT_KEY, CourseAnnouncementsState } from './course-announcement.reducer';
import { COURSE_ANNOUNCEMENT_DETAILS_KEY, CourseAnnouncementDetailsState } from './course-announcement-details.reducer';

export const selectCourseAnnouncementFeature = createFeatureSelector<CourseAnnouncementsState>(COURSE_ANNOUNCEMENT_KEY);
export const selectAllCourseAnnouncements = createSelector(selectCourseAnnouncementFeature, (state: CourseAnnouncementsState) => state);

export const selectCourseAnnouncementDetailsFeature = createFeatureSelector<CourseAnnouncementDetailsState>(COURSE_ANNOUNCEMENT_DETAILS_KEY);
export const selectCourseAnnouncementDetails = createSelector(selectCourseAnnouncementDetailsFeature, (state: CourseAnnouncementDetailsState) => state);
