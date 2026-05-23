import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { MaterialItemBo } from '../bo/material-item.bo';

import { CreateMaterialFormGroupInterface } from '../interfaces/create-material-form-group.interface';
import { ReviewMaterialFormGroupInterface } from '../interfaces/review-material-form-group.interface';

export const MaterialActions = createActionGroup({
  source: 'Material',
  events: {
    'reset Material State': emptyProps(),

    'load Approved Materials By Course': props<{ courseId: string }>(),
    'load Approved Materials By Course Success': props<{ materials: MaterialItemBo[] }>(),
    'load Approved Materials By Course Failure': props<{ error: Error }>(),

    'load Pending Materials By Course': props<{ courseId: string }>(),
    'load Pending Materials By Course Success': props<{ materials: MaterialItemBo[] }>(),
    'load Pending Materials By Course Failure': props<{ error: Error }>(),

    'upload Material': props<{ material: CreateMaterialFormGroupInterface }>(),
    'cancel Upload Material': emptyProps(),
    'upload Material Progress': props<{
      progress: number;
    }>(),
    'upload Material Success': emptyProps(),
    'upload Material Failure': props<{ error: Error }>(),

    'review Material': props<{
      id: string;
      courseId: string;
      material: ReviewMaterialFormGroupInterface;
    }>(),
    'review Material Success': emptyProps(),
    'review Material Failure': props<{ error: Error }>(),

    'delete Material': props<{ courseId: string, id: string }>(),
    'delete Material Success': emptyProps(),
    'delete Material Failure': props<{ error: Error }>(),
  }
});
