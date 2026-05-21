import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { StudentActions } from './student.action';
import { StudentService } from '../service/student.service';

import { StudentItemBo } from '../bo/student-item.bo';
import { StudentDetailsBo } from '../bo/student-details.bo';

@Injectable()
export class StudentEffect {

  private actions$ = inject(Actions);
  private studentService = inject(StudentService);

  public $loadStudents = createEffect(() =>
    this.actions$
      .pipe(
        ofType(StudentActions.loadStudents),
        switchMap(() => {
          return this.studentService
            .getStudents()
            .pipe(
              map((studentsList: Array<StudentItemBo>) => {
                return StudentActions.loadStudentsSuccess({ students: studentsList });
              }),
              catchError((error) => {
                return of(StudentActions.loadStudentsFailure({ error: error.error }));
              })
            );
        })
      )
  );

  /*
   * Load Student Details
   */
  public $loadStudentDetails = createEffect(() =>
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
                return of(StudentActions.loadStudentDetailsFailure({ error: error.error }));
              })
            );
        })
      )
  );

  /*
   * Create Student
   */
  public $createStudent = createEffect(() =>
    this.actions$
      .pipe(
        ofType(StudentActions.createStudent),
        switchMap((action) => {
          return this.studentService
            .createStudent(action.student)
            .pipe(
              switchMap(() => {
                return [
                  StudentActions.createStudentSuccess(),
                  StudentActions.loadStudents(),
                  StudentActions.resetStudentState()
                ];
              }),
              catchError((error) => {
                return of(StudentActions.createStudentFailure({ error: error.error }));
              })
            );
        })
      )
  );

  /*
   * Update Student
   */
  public $updateStudent = createEffect(() =>
    this.actions$
      .pipe(
        ofType(StudentActions.updateStudent),
        switchMap((action) => {
          return this.studentService
            .updateStudent(action.id, action.student)
            .pipe(
              switchMap(() => {
                return [
                  StudentActions.updateStudentSuccess(),
                  StudentActions.loadStudents(),
                  StudentActions.resetStudentState()
                ];
              }),
              catchError((error) => {
                return of(StudentActions.updateStudentFailure({ error: error.error }));
              })
            );
        })
      )
  );

  /*
   * Delete Student
   */
  public $deleteStudent = createEffect(() =>
    this.actions$
      .pipe(
        ofType(StudentActions.deleteStudent),
        switchMap((action) => {
          return this.studentService
            .deleteStudent(action.id)
            .pipe(
              switchMap(() => {
                return [
                  StudentActions.deleteStudentSuccess(),
                  StudentActions.loadStudents(),
                  StudentActions.resetStudentState()
                ];
              }),
              catchError((error) => {
                return of(StudentActions.deleteStudentFailure({ error: error.error }));
              })
            );
        })
      )
  );

  constructor() {
  }
}
