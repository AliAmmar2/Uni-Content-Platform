import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import * as _ from 'lodash';

import { MajorItemBo } from '../bo/major-item.bo';
import { MajorDetailsBo } from '../bo/major-details.bo';

import { MajorForCreationDto } from '../dtos/major-for-creation.dto';
import { MajorForUpdateDto } from '../dtos/major-for-update.dto';

import { CreateMajorFormGroupInterface } from '../interfaces/create-major-form-group.interface';
import { MajorModel } from '../../_clients/major/models/major-item.model';
import { MajorClient } from '../../_clients/major/major.client';

@Injectable({ providedIn: 'root' })
export class MajorService {

  constructor(private majorClient: MajorClient) {
  }

  // GET MAJORS BY FACULTY
  getMajorsByFaculty(
    facultyId: string
  ): Observable<Array<MajorItemBo>> {
    return this.majorClient.getMajorsByFaculty(facultyId).pipe(
      map((majors: Array<MajorModel>) =>
        _.map(majors, major => new MajorItemBo(major))
      )
    );
  }

  // GET ALL
  getMajors(): Observable<Array<MajorItemBo>> {
    return this.majorClient.getMajors().pipe(
      map((majors: Array<MajorModel>) =>
        _.map(majors, m => new MajorItemBo(m))
      )
    );
  }

  // GET BY ID (with courses)
  getMajorById(id: string): Observable<MajorDetailsBo> {
    return this.majorClient.getMajorById(id).pipe(
      map((major: any) => new MajorDetailsBo(major))
    );
  }

  // CREATE
  createMajor(formValue: CreateMajorFormGroupInterface): Observable<any> {
    const dto = new MajorForCreationDto(formValue);
    return this.majorClient.createMajor(dto);
  }

  // UPDATE
  updateMajor(id: string, formValue: CreateMajorFormGroupInterface): Observable<any> {
    const dto = new MajorForUpdateDto(formValue);
    return this.majorClient.updateMajor(id, dto);
  }

  // DELETE
  deleteMajor(id: string): Observable<any> {
    return this.majorClient.deleteMajor(id);
  }
}
