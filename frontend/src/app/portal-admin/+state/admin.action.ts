import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AdminItemBo } from '../bo/admin-item.bo';
import { AdminDetailsBo } from '../bo/admin-details.bo';

import { CreateAdminFormGroupInterface } from '../interfaces/create-admin-form-group.interface';
import { UpdateAdminFormGroupInterface } from '../interfaces/update-admin-form-group.interface';

export const AdminActions = createActionGroup({
  source: 'Admin',
  events: {
    'reset Admin State': emptyProps(),

    'load Admins': emptyProps(),
    'load Admins Success': props<{ admins: AdminItemBo[] }>(),
    'load Admins Failure': props<{ error: Error }>(),

    'load Admin Details': props<{ id: string }>(),
    'load Admin Details Success': props<{ admin: AdminDetailsBo }>(),
    'load Admin Details Failure': props<{ error: Error }>(),

    'load Me': emptyProps(),
    'load Me Success': props<{ admin: AdminDetailsBo }>(),
    'load Me Failure': props<{ error: Error }>(),

    'create Admin': props<{ admin: CreateAdminFormGroupInterface }>(),
    'create Admin Success': emptyProps(),
    'create Admin Failure': props<{ error: Error }>(),

    'update Admin': props<{ id: string; admin: UpdateAdminFormGroupInterface }>(),
    'update Admin Success': emptyProps(),
    'update Admin Failure': props<{ error: Error }>(),

    'delete Admin': props<{ id: string }>(),
    'delete Admin Success': emptyProps(),
    'delete Admin Failure': props<{ error: Error }>(),
  }
});
