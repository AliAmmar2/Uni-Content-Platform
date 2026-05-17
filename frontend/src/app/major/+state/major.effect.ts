import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';

import { MajorItemBo } from '../bo/major-item.bo';
import { MajorDetailsBo } from '../bo/major-details.bo';

import { MajorActions } from './major.action';
import { MajorService } from '../service/major.service';

@Injectable()
export class MajorEffects {

  private actions$ = inject(Actions);
  private majorService = inject(MajorService);

  public loadMajors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MajorActions.loadMajors),
      switchMap(() => {
        return this.majorService.getMajors().pipe(
          map((majors: Array<MajorItemBo>) => {
            return MajorActions.loadMajorsSuccess({
              majors
            });
          }),
          catchError((error) => {
            return of(MajorActions.loadMajorsFailure({ error: error.error }));
          })
        );
      })
    )
  );

  public loadMajorsByFaculty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MajorActions.loadMajorsByFaculty),
      switchMap((action) => {
        return this.majorService.getMajorsByFaculty(action.facultyId).pipe(
          map((majors: Array<MajorItemBo>) => {
            return MajorActions.loadMajorsByFacultySuccess({
              majors
            });
          }),
          catchError((error) => {
            return of(
              MajorActions.loadMajorsByFacultyFailure({
                error: error.error
              })
            );
          })
        );
      })
    )
  );

  public loadMajorDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MajorActions.loadMajorDetails),
      switchMap((action) => {
        return this.majorService.getMajorById(action.id).pipe(
          map((major: MajorDetailsBo) => {
            return MajorActions.loadMajorDetailsSuccess({
              major
            });
          }),
          catchError((error) => {
            return of(MajorActions.loadMajorDetailsFailure({ error: error.error }));
          })
        );
      })
    )
  );

  public createMajor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MajorActions.createMajor),
      switchMap((action) => {
        return this.majorService.createMajor(action.major).pipe(
          switchMap(() => {
            return [
              MajorActions.createMajorSuccess(),
              MajorActions.loadMajors(),
              MajorActions.resetMajorState()
            ];
          }),
          catchError((error) => {
            return of(MajorActions.createMajorFailure({ error: error.error }));
          })
        );
      })
    )
  );

  public updateMajor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MajorActions.updateMajor),
      switchMap((action) => {
        return this.majorService.updateMajor(action.id, action.major).pipe(
          switchMap(() => {
            return [
              MajorActions.updateMajorSuccess(),
              MajorActions.loadMajors(),
              MajorActions.resetMajorState()
            ];
          }),
          catchError((error) => {
            return of(MajorActions.updateMajorFailure({ error: error.error }));
          })
        );
      })
    )
  );

  public deleteMajor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MajorActions.deleteMajor),
      switchMap((action) => {
        return this.majorService.deleteMajor(action.id).pipe(
          switchMap(() => {
            return [
              MajorActions.deleteMajorSuccess(),
              MajorActions.loadMajors(),
              MajorActions.resetMajorState()
            ];
          }),
          catchError((error) => {
            return of(MajorActions.deleteMajorFailure({ error: error.error }));
          })
        );
      })
    )
  );
}
