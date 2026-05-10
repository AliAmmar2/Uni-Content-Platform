import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FacultyItemBo } from '../bo/faculty-item.bo';
import { FacultyActions } from './faculty.action';
import { FacultyService } from '../service/faculty.service';
import { MajorActions } from '../../major/+state/major.action';
import { MajorDetailsBo } from '../../major/bo/major-details.bo';
import { FacultyDetailsBo } from '../bo/faculty-details.bo';

@Injectable()
export class FacultyEffect {
  private actions$ = inject(Actions);
  private facultiesService = inject(FacultyService);
  public $loadFaculties = createEffect(() =>
    this.actions$
      .pipe(
        ofType(FacultyActions.loadFaculties),
        switchMap(() => {
          return this.facultiesService
            .getFaculties()
            .pipe(
              map((facultiesList: Array<FacultyItemBo>) => {
                return FacultyActions.loadFacultiesSuccess({
                  faculties: facultiesList
                });
              }),
              catchError((error) => {
                return of(FacultyActions.loadFacultiesFailure({ error }));
              })
            );
        })
      )
  );

  public loadFacultyDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FacultyActions.loadFacultyDetails),
      switchMap((action) => {
        return this.facultiesService.getFacultyById(action.id).pipe(
          map((faculty: FacultyDetailsBo) => {
            return FacultyActions.loadFacultyDetailsSuccess({
              faculty: faculty
            });
          }),
          catchError((error) => {
            return of(FacultyActions.loadFacultyDetailsFailure({ error }));
          })
        );
      })
    )
  );


  public $updateFaculty = createEffect(() =>
    this.actions$
      .pipe(
        ofType(FacultyActions.updateFaculty),
        switchMap((action) => {
          return this.facultiesService
            .updateFaculty(action.id, action.faculty)
            .pipe(
              switchMap(() => {
                return [
                  FacultyActions.updateFacultySuccess(),
                  FacultyActions.loadFaculties(),
                  FacultyActions.resetFacultyState()
                ];
              }),
              catchError((error) => {
                return of(FacultyActions.updateFacultyFailure({ error }));
              })
            );
        })
      )
  );

  public $createFaculty = createEffect(() =>
    this.actions$
      .pipe(
        ofType(FacultyActions.createFaculty),
        switchMap((action) => {
          return this.facultiesService
            .createFaculty(action.faculty)
            .pipe(
              switchMap(() => {
                return [
                  FacultyActions.createFacultySuccess(),
                  FacultyActions.loadFaculties(),
                  FacultyActions.resetFacultyState()
                ];
              }),
              catchError((error) => {
                return of(FacultyActions.createFacultyFailure({ error }));
              })
            );
        })
      )
  );

  public $deleteFaculty = createEffect(() =>
    this.actions$
      .pipe(
        ofType(FacultyActions.deleteFaculty),
        switchMap((action) => {
          return this.facultiesService
            .deleteFaculty(action.id)
            .pipe(
              switchMap(() => {
                return [
                  FacultyActions.deleteFacultySuccess(),
                  FacultyActions.loadFaculties(),
                  FacultyActions.resetFacultyState()
                ];
              }),
              catchError((error) => {
                return of(FacultyActions.deleteFacultyFailure({ error }));
              })
            );
        })
      )
  );
}
