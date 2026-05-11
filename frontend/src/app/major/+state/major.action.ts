import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { MajorItemBo } from '../bo/major-item.bo';
import { MajorDetailsBo } from '../bo/major-details.bo';

import { CreateMajorFormGroupInterface } from '../interfaces/create-major-form-group.interface';
import { UpdateMajorFormGroupInterface } from '../interfaces/update-major-form-group.interface';

export const MajorActions = createActionGroup({
  source: 'Major',
  events: {

    'reset Major State': emptyProps(),

    'load Majors': emptyProps(),
    'load Majors Success': props<{ majors: MajorItemBo[] }>(),
    'load Majors Failure': props<{ error: Error }>(),

    'load Majors By Faculty': props<{ facultyId: string }>(),
    'load Majors By Faculty Success': props<{ majors: MajorItemBo[] }>(),
    'load Majors By Faculty Failure': props<{ error: Error }>(),

    'load Major Details': props<{ id: string }>(),
    'load Major Details Success': props<{ major: MajorDetailsBo }>(),
    'load Major Details Failure': props<{ error: Error }>(),

    'create Major': props<{ major: CreateMajorFormGroupInterface }>(),
    'create Major Success': emptyProps(),
    'create Major Failure': props<{ error: Error }>(),

    'update Major': props<{ id: string; major: UpdateMajorFormGroupInterface }>(),
    'update Major Success': emptyProps(),
    'update Major Failure': props<{ error: Error }>(),

    'delete Major': props<{ id: string }>(),
    'delete Major Success': emptyProps(),
    'delete Major Failure': props<{ error: Error }>(),
  }
});
