import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { map, Observable } from 'rxjs';

import { FacultyItemBo } from '../bo/faculty-item.bo';

import { FacultyModel } from '../../_clients/faculty/models/faculty.model';

import { CreateFacultyFormGroupInterface } from '../interfaces/create-faculty-form-group.interface';

import { FacultyForCreationDto } from '../dtos/faculty-for-creation.dto';
import { FacultyForUpdateDto } from '../dtos/faculty-for-update.dto';
import { FacultyClient } from '../../_clients/faculty/faculty.client';
import { FacultyDetailsBo } from '../bo/faculty-details.bo';
import { FacultyDetailsModel } from '../../_clients/faculty/models/faculty-details.model';

@Injectable({ providedIn: 'root' })
export class FacultyService {

  constructor(private facultyClient: FacultyClient) {
  }

  public getFaculties(): Observable<Array<FacultyItemBo>> {
    return this.facultyClient
      .getFaculties()
      .pipe(
        map((facultyModels: Array<FacultyModel>) => {
          return _.map(
            facultyModels,
            facultyModel => new FacultyItemBo(facultyModel)
          );
        })
      );
  }



  public createFaculty(
    facultyFormValue: CreateFacultyFormGroupInterface
  ): Observable<any> {

    const facultyForCreationDto: FacultyForCreationDto =
      new FacultyForCreationDto(facultyFormValue);

    return this.facultyClient.createFaculty(
      facultyForCreationDto
    );
  }

  public getFacultyById(facultyId: string): Observable<FacultyDetailsBo> {
    return this.facultyClient
      .getFacultyById(facultyId)
      .pipe(
        map((facultyDetailsModel: FacultyDetailsModel) => {
          return new FacultyDetailsBo(facultyDetailsModel);
        })
      );
  }
  public updateFaculty(
    facultyId: string,
    facultyFormValue: CreateFacultyFormGroupInterface
  ): Observable<any> {

    const facultyForUpdateDto: FacultyForUpdateDto =
      new FacultyForUpdateDto(facultyFormValue);

    return this.facultyClient.updateFaculty(
      facultyId,
      facultyForUpdateDto
    );
  }

  public deleteFaculty(facultyId: string): Observable<any> {
    return this.facultyClient.deleteFaculty(facultyId);
  }
}
