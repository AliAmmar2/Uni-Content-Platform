import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { StudentActions } from './student.action';
import { StudentService } from '../service/student.service';
import { StudentDetailsBo } from '../bo/student-details.bo';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class StudentEffect {
  private actions$ = inject(Actions);
  private studentService = inject(StudentService);
  public loadStudentDetails$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(StudentActions.loadStudentDetails),
        switchMap((action) => {
          return this.studentService
            .getStudentDetails(action.studentId)
            .pipe(
              map((studentDetailsBo: StudentDetailsBo) => {
                return StudentActions.loadStudentDetailsSuccess({
                  student: studentDetailsBo
                });
              }),
              catchError((error) => {
                return of(StudentActions.loadStudentDetailsFailure({ error: error }));
              })
            );
        })
      ));

  constructor() {
  }
}
