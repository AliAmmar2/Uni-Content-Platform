import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';

import { AdminClient } from '../../_clients/admin/admin.client';

import { AdminItemBo } from '../bo/admin-item.bo';
import { AdminDetailsBo } from '../bo/admin-details.bo';

import { AdminModel } from '../../_clients/admin/models/admin.model';
import { AdminDetailsModel } from '../../_clients/admin/models/admin-details.model';

import { CreateAdminFormGroupInterface } from '../interfaces/create-admin-form-group.interface';
import { UpdateAdminFormGroupInterface } from '../interfaces/update-admin-form-group.interface';

import { AdminForCreationDto } from '../dtos/admin-for-creation.dto';
import { AdminForUpdateDto } from '../dtos/admin-for-update.dto';

@Injectable({ providedIn: 'root' })
export class AdminService {

  constructor(private adminClient: AdminClient) {}
  public getAdmins(): Observable<Array<AdminItemBo>> {
    return this.adminClient
      .getAdmins()
      .pipe(
        map((adminModels: Array<AdminModel>) => {
          return _.map(
            adminModels,
            adminModel => new AdminItemBo(adminModel)
          );
        })
      );
  }

  public createAdmin(
    adminFormValue: CreateAdminFormGroupInterface
  ): Observable<any> {

    const adminForCreationDto = new AdminForCreationDto(adminFormValue);

    return this.adminClient.createAdmin(
      adminForCreationDto.toJSON()
    );
  }

  public getAdminById(adminId: string): Observable<AdminDetailsBo> {
    return this.adminClient
      .getAdminById(adminId)
      .pipe(
        map((adminDetailsModel: AdminDetailsModel) => {
          return new AdminDetailsBo(adminDetailsModel);
        })
      );
  }

  public getMe(): Observable<AdminDetailsBo> {
    return this.adminClient
      .getMe()
      .pipe(
        map((adminDetailsModel: AdminDetailsModel) => {
          return new AdminDetailsBo(adminDetailsModel);
        })
      );
  }

  public updateAdmin(
    adminId: string,
    adminFormValue: UpdateAdminFormGroupInterface
  ): Observable<any> {

    const adminForUpdateDto = new AdminForUpdateDto(adminFormValue);
console.log(adminForUpdateDto.toJSON(),'lashof hon');
    return this.adminClient.updateAdmin(
      adminId,
      adminForUpdateDto.toJSON()
    );
  }

  public deleteAdmin(adminId: string): Observable<any> {
    return this.adminClient.deleteAdmin(adminId);
  }
}
