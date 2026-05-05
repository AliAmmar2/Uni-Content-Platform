import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CourseService } from '../service/course.service';
import { CoursesDetailsBo } from '../bo/courses-details.bo';
import { inject, Injectable } from '@angular/core';
import { CoursesActions } from './courses.action';

@Injectable()
export class CoursesEffect {
  private actions$ = inject(Actions);
  private courseService = inject(CourseService);
  public $loadUsers = createEffect(() =>
    this.actions$
      .pipe(
        ofType(CoursesActions.loadCourses),
        switchMap((action) => {
          return this.courseService
            .getCourses(action.academicYear, action.calendarYear)
            .pipe(
              map((coursesList: CoursesDetailsBo[]) => {
                return CoursesActions.loadCoursesSuccess({ courses: coursesList });
              }),
              catchError((error) => {
                return of(CoursesActions.loadCoursesFailure({ error: error }));
              })
            );
        })
      ));

  constructor() {
  }
}
