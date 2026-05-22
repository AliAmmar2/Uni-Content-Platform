import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { MaterialModel } from './models/material.model';
import { ReviewMaterialModel } from './models/review-material.model';

export interface MaterialResponseModel {
  message: string;
  material: MaterialModel;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialClient {

  private readonly API_URL = 'http://localhost:5000/materials';

  constructor(
    private http: HttpClient
  ) {}

  private getAuthOptions() {
    const token = localStorage.getItem('accessToken');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public uploadMaterial(
    formData: FormData
  ): Observable<MaterialResponseModel> {

    return this.http.post<MaterialResponseModel>(
      `${this.API_URL}/upload`,
      formData,
      this.getAuthOptions()
    );
  }

  public getApprovedMaterialsByCourse(
    courseId: string
  ): Observable<MaterialModel[]> {
    return this.http.get<MaterialModel[]>(
      `${this.API_URL}/course/${courseId}`,
      this.getAuthOptions()
    );
  }

  public getPendingMaterialsByCourse(
    courseId: string
  ): Observable<MaterialModel[]> {
    return this.http.get<MaterialModel[]>(
      `${this.API_URL}/course/${courseId}/pending`,
      this.getAuthOptions()
    );
  }

  public reviewMaterial(
    materialId: string,
    payload: ReviewMaterialModel
  ): Observable<MaterialResponseModel> {
    return this.http.put<MaterialResponseModel>(
      `${this.API_URL}/${materialId}/approve`,
      payload,
      this.getAuthOptions()
    );
  }

  public deleteMaterial(
    materialId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.API_URL}/${materialId}`,
      this.getAuthOptions()
    );
  }
}
