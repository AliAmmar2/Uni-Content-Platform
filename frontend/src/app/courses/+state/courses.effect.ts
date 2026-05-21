import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';
import { CoursesService } from '../service/course.service';
import { CourseActions } from './courses.action';
import { CourseItemBo } from '../bo/course-item.bo';
import { CourseDetailsBo } from '../bo/course-details.bo';

@Injectable()
export class CourseEffects {

  private actions$ = inject(Actions);
  private courseService = inject(CoursesService);

  public loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadAllCourses),
      switchMap(() => {
        return this.courseService.getAllCourses().pipe(
          map((courses: CourseItemBo[]) =>
            CourseActions.loadAllCoursesSuccess({ courses })
          ),
          catchError((error) =>
            of(CourseActions.loadAllCoursesFailure({ error: error.error }))
          )
        );
      })
    )
  );

  public loadFilteredCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadFilteredCourses),
      switchMap((action) => {
        return this.courseService.getCoursesFiltered(action).pipe(
          map((courses: CourseItemBo[]) =>
            CourseActions.loadFilteredCoursesSuccess({ courses })
          ),
          catchError((error) =>
            of(CourseActions.loadFilteredCoursesFailure({ error: error.error }))
          )
        );
      })
    )
  );

  public loadMyMajorCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadMyMajorCourses),
      switchMap(() => {
        return this.courseService.getMyMajorCourses().pipe(
          map((courses: CourseItemBo[]) =>
            CourseActions.loadMyMajorCoursesSuccess({ courses })
          ),
          catchError((error) =>
            of(CourseActions.loadMyMajorCoursesFailure({ error: error.error }))
          )
        );
      })
    )
  );

  public loadCourseDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourseDetails),
      switchMap((action) => {
        return this.courseService.getCourseById(action.id).pipe(
          map((course: CourseDetailsBo) =>
            CourseActions.loadCourseDetailsSuccess({ course })
          ),
          catchError((error) =>
            of(CourseActions.loadCourseDetailsFailure({ error: error.error }))
          )
        );
      })
    )
  );

  public createCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.createCourse),
      switchMap((action) => {
        return this.courseService.createCourse(action.course).pipe(
          switchMap(() => [
            CourseActions.createCourseSuccess(),
            CourseActions.loadAllCourses(),
            CourseActions.resetCourseState()
          ]),
          catchError((error) =>
            of(CourseActions.createCourseFailure({ error: error.error }))
          )
        );
      })
    )
  );

  public updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.updateCourse),
      switchMap((action) => {
        return this.courseService.updateCourse(action.id, action.course).pipe(
          switchMap(() => [
            CourseActions.updateCourseSuccess(),
            CourseActions.loadAllCourses(),
            CourseActions.resetCourseState()
          ]),
          catchError((error) =>
            of(CourseActions.updateCourseFailure({ error: error.error }))
          )
        );
      })
    )
  );

  public deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.deleteCourse),
      switchMap((action) => {
        return this.courseService.deleteCourse(action.id).pipe(
          switchMap(() => [
            CourseActions.deleteCourseSuccess(),
            CourseActions.loadAllCourses(),
            CourseActions.resetCourseState()
          ]),
          catchError((error) =>
            of(CourseActions.deleteCourseFailure({ error: error.error }))
          )
        );
      })
    )
  );
}
