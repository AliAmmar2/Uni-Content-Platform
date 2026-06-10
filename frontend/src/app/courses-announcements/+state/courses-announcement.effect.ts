import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';

import { CourseAnnouncementActions } from './courses-announcement.action';

import { CourseAnnouncementItemBo } from '../bos/course-announcement-item.bo';
import { CoursesAnnouncementsService } from '../service/course-announcement.service';

@Injectable()
export class CourseAnnouncementEffects {

  private actions$ = inject(Actions);

  private coursesAnnouncementsService =
    inject(CoursesAnnouncementsService);

  public loadCourseAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseAnnouncementActions.loadCourseAnnouncements),
      switchMap((action) =>
        this.coursesAnnouncementsService
          .getCourseAnnouncements(action.courseId)
          .pipe(
            map((announcements: CourseAnnouncementItemBo[]) =>
              CourseAnnouncementActions.loadCourseAnnouncementsSuccess({
                announcements
              })
            ),
            catchError((error) =>
              of(
                CourseAnnouncementActions.loadCourseAnnouncementsFailure({
                  error: error.error
                })
              )
            )
          )
      )
    )
  );

  public loadCourseAnnouncementDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseAnnouncementActions.loadCourseAnnouncementDetails),
      switchMap((action) =>
        this.coursesAnnouncementsService
          .getAnnouncementById(action.announcementId)
          .pipe(
            map((announcement: CourseAnnouncementItemBo) =>
              CourseAnnouncementActions.loadCourseAnnouncementDetailsSuccess({
                announcement
              })
            ),
            catchError((error) =>
              of(
                CourseAnnouncementActions.loadCourseAnnouncementDetailsFailure({
                  error: error.error
                })
              )
            )
          )
      )
    )
  );

  public createCourseAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseAnnouncementActions.createCourseAnnouncement),
      switchMap((action) =>
        this.coursesAnnouncementsService
          .createCourseAnnouncement(action.announcement)
          .pipe(
            switchMap(() => [
              CourseAnnouncementActions.createCourseAnnouncementSuccess(),

              CourseAnnouncementActions.loadCourseAnnouncements({
                courseId: action.announcement.courseId
              }),

              CourseAnnouncementActions.resetCourseAnnouncementState()
            ]),
            catchError((error) =>
              of(
                CourseAnnouncementActions.createCourseAnnouncementFailure({
                  error: error.error
                })
              )
            )
          )
      )
    )
  );

  public updateCourseAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseAnnouncementActions.updateCourseAnnouncement),
      switchMap((action) =>
        this.coursesAnnouncementsService
          .updateCourseAnnouncement(
            action.announcementId,
            action.announcement
          )
          .pipe(
            switchMap(() => [
              CourseAnnouncementActions.updateCourseAnnouncementSuccess(),

              CourseAnnouncementActions.loadCourseAnnouncements({
                courseId: action.courseId
              }),

              CourseAnnouncementActions.resetCourseAnnouncementState()
            ]),
            catchError((error) =>
              of(
                CourseAnnouncementActions.updateCourseAnnouncementFailure({
                  error: error.error
                })
              )
            )
          )
      )
    )
  );

  public deleteCourseAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseAnnouncementActions.deleteCourseAnnouncement),
      switchMap((action) =>
        this.coursesAnnouncementsService
          .deleteCourseAnnouncement(action.announcementId)
          .pipe(
            switchMap(() => [
              CourseAnnouncementActions.deleteCourseAnnouncementSuccess(),

              CourseAnnouncementActions.loadCourseAnnouncements({
                courseId: action.courseId
              }),

              CourseAnnouncementActions.resetCourseAnnouncementState()
            ]),
            catchError((error) =>
              of(
                CourseAnnouncementActions.deleteCourseAnnouncementFailure({
                  error: error.error
                })
              )
            )
          )
      )
    )
  );
}
