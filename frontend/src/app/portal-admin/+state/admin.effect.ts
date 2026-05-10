import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { AdminActions } from './admin.action';
import { AdminService } from '../service/admin.service';

import { AdminItemBo } from '../bo/admin-item.bo';
import { AdminDetailsBo } from '../bo/admin-details.bo';

@Injectable()
export class AdminEffects {

  private actions$ = inject(Actions);
  private adminService = inject(AdminService);

  loadAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdmins),
      switchMap(() =>
        this.adminService.getAdmins().pipe(
          map((admins: AdminItemBo[]) =>
            AdminActions.loadAdminsSuccess({ admins })
          ),
          catchError((error) =>
            of(AdminActions.loadAdminsFailure({ error }))
          )
        )
      )
    )
  );

  loadAdminDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminDetails),
      switchMap((action) =>
        this.adminService.getAdminById(action.id).pipe(
          map((admin: AdminDetailsBo) =>
            AdminActions.loadAdminDetailsSuccess({ admin })
          ),
          catchError((error) =>
            of(AdminActions.loadAdminDetailsFailure({ error }))
          )
        )
      )
    )
  );

  loadMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadMe),
      switchMap(() =>
        this.adminService.getMe().pipe(
          map((admin: AdminDetailsBo) =>
            AdminActions.loadMeSuccess({ admin })
          ),
          catchError((error) =>
            of(AdminActions.loadMeFailure({ error }))
          )
        )
      )
    )
  );

  createAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.createAdmin),
      switchMap((action) =>
        this.adminService.createAdmin(action.admin).pipe(
          switchMap(() => [
            AdminActions.createAdminSuccess(),
            AdminActions.loadAdmins(),
            AdminActions.resetAdminState()
          ]),
          catchError((error) =>
            of(AdminActions.createAdminFailure({ error }))
          )
        )
      )
    )
  );

  updateAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateAdmin),
      switchMap((action) =>
        this.adminService.updateAdmin(action.id, action.admin).pipe(
          switchMap(() => [
            AdminActions.updateAdminSuccess(),
            AdminActions.loadMe(),
            AdminActions.loadAdmins(),
            AdminActions.resetAdminState()
          ]),
          catchError((error) =>
            of(AdminActions.updateAdminFailure({ error }))
          )
        )
      )
    )
  );

  deleteAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deleteAdmin),
      switchMap((action) =>
        this.adminService.deleteAdmin(action.id).pipe(
          switchMap(() => [
            AdminActions.deleteAdminSuccess(),
            AdminActions.loadAdmins(),
            AdminActions.resetAdminState()
          ]),
          catchError((error) =>
            of(AdminActions.deleteAdminFailure({ error }))
          )
        )
      )
    )
  );
}
