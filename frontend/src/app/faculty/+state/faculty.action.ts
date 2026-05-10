import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FacultyItemBo } from '../bo/faculty-item.bo';
import { UpdateFacultyFormGroupInterface } from '../interfaces/update-faculty-form-group.interface';
import { CreateFacultyFormGroupInterface } from '../interfaces/create-faculty-form-group.interface';
import { FacultyDetailsBo } from '../bo/faculty-details.bo';

export const FacultyActions = createActionGroup({
  source: 'Faculty',
  events: {
    'reset Faculty State': emptyProps(),

    'load Faculties': emptyProps(),
    'load Faculties Success': props<{ faculties: FacultyItemBo[] }>(),
    'load Faculties Failure': props<{ error: Error }>(),

    'load Faculty Details': props<{ id: string }>(),
    'load Faculty Details Success': props<{ faculty: FacultyDetailsBo }>(),
    'load Faculty Details Failure': props<{ error: Error }>(),

    'create Faculty': props<{ faculty: CreateFacultyFormGroupInterface }>(),
    'create Faculty Success': emptyProps(),
    'create Faculty Failure': props<{ error: Error }>(),

    'update Faculty': props<{ id: string; faculty: UpdateFacultyFormGroupInterface }>(),
    'update Faculty Success': emptyProps(),
    'update Faculty Failure': props<{ error: Error }>(),


    'delete Faculty': props<{ id: string }>(),
    'delete Faculty Success': emptyProps(),
    'delete Faculty Failure': props<{ error: Error }>(),
  }
});
