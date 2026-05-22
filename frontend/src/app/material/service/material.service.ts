import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { map, Observable } from 'rxjs';

import { MaterialClient, MaterialResponseModel } from '../../_clients/material/material.client';

import { MaterialModel } from '../../_clients/material/models/material.model';

import { MaterialItemBo } from '../bo/material-item.bo';

import { CreateMaterialFormGroupInterface } from '../interfaces/create-material-form-group.interface';
import { ReviewMaterialFormGroupInterface } from '../interfaces/review-material-form-group.interface';

import { MaterialForCreationDto } from '../dtos/material-for-creation.dto';
import { MaterialForReviewDto } from '../dtos/material-for-review.dto';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(
    private materialClient: MaterialClient
  ) {
  }

  public uploadMaterial(
    materialFormValue: CreateMaterialFormGroupInterface
  ): Observable<MaterialResponseModel> {

    const materialForCreationDto =
      new MaterialForCreationDto(materialFormValue);

    return this.materialClient.uploadMaterial(
      materialForCreationDto.toFormData()
    );
  }

  public getApprovedMaterialsByCourse(
    courseId: string
  ): Observable<MaterialItemBo[]> {

    return this.materialClient
      .getApprovedMaterialsByCourse(courseId)
      .pipe(
        map((materialModels: MaterialModel[]) => {
          return _.map(
            materialModels,
            materialModel => new MaterialItemBo(materialModel)
          );
        })
      );
  }

  public getPendingMaterialsByCourse(
    courseId: string
  ): Observable<MaterialItemBo[]> {

    return this.materialClient
      .getPendingMaterialsByCourse(courseId)
      .pipe(
        map((materialModels: MaterialModel[]) => {
          return _.map(
            materialModels,
            materialModel => new MaterialItemBo(materialModel)
          );
        })
      );
  }

  public reviewMaterial(
    materialId: string,
    reviewFormValue: ReviewMaterialFormGroupInterface
  ): Observable<MaterialResponseModel> {

    const materialForReviewDto =
      new MaterialForReviewDto(reviewFormValue);

    return this.materialClient.reviewMaterial(
      materialId,
      materialForReviewDto
    );
  }

  public deleteMaterial(
    materialId: string
  ): Observable<{ message: string }> {

    return this.materialClient.deleteMaterial(materialId);
  }
}
