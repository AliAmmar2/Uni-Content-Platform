import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, takeUntil } from 'rxjs';

import { MaterialActions } from './material.action';
import { MaterialService } from '../service/material.service';
import { MaterialItemBo } from '../bo/material-item.bo';

@Injectable()
export class MaterialEffect {

  private actions$ = inject(Actions);

  private materialService = inject(MaterialService);

  public loadApprovedMaterialsByCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadApprovedMaterialsByCourse),
      switchMap((action) => {
        return this.materialService
          .getApprovedMaterialsByCourse(action.courseId)
          .pipe(
            map((materials: MaterialItemBo[]) => {
              return MaterialActions.loadApprovedMaterialsByCourseSuccess({
                materials
              });
            }),
            catchError((error) => {
              return of(
                MaterialActions.loadApprovedMaterialsByCourseFailure({
                  error: error.error
                })
              );
            })
          );
      })
    )
  );

  public loadPendingMaterialsByCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadPendingMaterialsByCourse),
      switchMap((action) => {
        return this.materialService
          .getPendingMaterialsByCourse(action.courseId)
          .pipe(
            map((materials: MaterialItemBo[]) => {
              return MaterialActions.loadPendingMaterialsByCourseSuccess({
                materials
              });
            }),
            catchError((error) => {
              return of(
                MaterialActions.loadPendingMaterialsByCourseFailure({
                  error: error.error
                })
              );
            })
          );
      })
    )
  );

  // public uploadMaterial$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(MaterialActions.uploadMaterial),
  //     switchMap((action) => {
  //       return this.materialService
  //         .uploadMaterial(action.material)
  //         .pipe(
  //           switchMap(() => {
  //             return [
  //               MaterialActions.uploadMaterialSuccess(),
  //               MaterialActions.resetMaterialState()
  //             ];
  //           }),
  //           catchError((error) => {
  //             return of(
  //               MaterialActions.uploadMaterialFailure({
  //                 error: error.error
  //               })
  //             );
  //           })
  //         );
  //     })
  //   )
  // );

  public uploadMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.uploadMaterial),
      switchMap((action) => {
        return this.materialService
          .uploadMaterial(action.material)
          .pipe(
            switchMap(() => [
              MaterialActions.uploadMaterialSuccess()
            ]),
            takeUntil(
              this.actions$.pipe(
                ofType(MaterialActions.cancelUploadMaterial)
              )
            ),
            catchError((error) => {
              return of(
                MaterialActions.uploadMaterialFailure({
                  error: error.error
                })
              );
            })
          );
      })
    )
  );

  public reviewMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.reviewMaterial),
      switchMap((action) => {
        return this.materialService
          .reviewMaterial(
            action.id,
            action.material
          )
          .pipe(
            switchMap(() => {
              return [
                MaterialActions.reviewMaterialSuccess(),
                MaterialActions.loadApprovedMaterialsByCourse({ courseId: action.courseId }),
                MaterialActions.loadPendingMaterialsByCourse({ courseId: action.courseId }),
                MaterialActions.resetMaterialState()
              ];
            }),
            catchError((error) => {
              return of(
                MaterialActions.reviewMaterialFailure({
                  error: error.error
                })
              );
            })
          );
      })
    )
  );

  public deleteMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.deleteMaterial),
      switchMap((action) => {
        return this.materialService
          .deleteMaterial(action.id)
          .pipe(
            switchMap(() => {
              return [
                MaterialActions.deleteMaterialSuccess(),
                MaterialActions.loadApprovedMaterialsByCourse({ courseId: action.courseId }),
                MaterialActions.loadPendingMaterialsByCourse({ courseId: action.courseId }),
                MaterialActions.resetMaterialState()
              ];
            }),
            catchError((error) => {
              return of(
                MaterialActions.deleteMaterialFailure({
                  error: error.error
                })
              );
            })
          );
      })
    )
  );

}
