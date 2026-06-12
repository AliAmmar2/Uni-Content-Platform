import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MaterialModel } from './models/material.model';
import { ReviewMaterialModel } from './models/review-material.model';
import { SaveMaterialPayload } from './models/save-material-payload.model';
import { UploadSignatureResponseModel } from './models/upload-signature-response.model';

export interface MaterialResponseModel {
  message: string;
  material: MaterialModel;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialClient {

  private readonly API_URL = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {
  }

  private getAuthOptions() {
    const token = localStorage.getItem('accessToken');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public getUploadSignature(
    filename: string,
    mimeType: string,
    fileSize: number
  ): Observable<UploadSignatureResponseModel> {
    return this.http.get<UploadSignatureResponseModel>(
      `${this.API_URL}/upload-signature`,
      {
        ...this.getAuthOptions(),
        params: {
          filename,
          mimeType,
          fileSize
        }
      }
    );
  }

  public uploadFileToSupabase(
    signedUrl: string,
    file: File
  ): Observable<unknown> {
    return this.http.put(
      signedUrl,
      file,
      {
        headers: new HttpHeaders({
          'Content-Type': file.type
        })
      }
    );
  }

  public uploadMaterial(
    payload: SaveMaterialPayload
  ): Observable<MaterialResponseModel> {
    return this.http.post<MaterialResponseModel>(
      `${this.API_URL}`,
      payload,
      this.getAuthOptions()
    );
  }


  public getApprovedMaterialsByCourse(courseId: string): Observable<MaterialModel[]> {
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

  public getMaterialAccessUrl(
    materialId: string,
    mode: 'view' | 'download' = 'view'
  ): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(
      `${this.API_URL}/${materialId}/access`,
      {
        ...this.getAuthOptions(),
        params: {
          mode
        }
      }
    );
  }

  public reviewMaterial(
    materialId: string,
    payload: ReviewMaterialModel
  ): Observable<MaterialResponseModel> {
    return this.http.put<MaterialResponseModel>(
      `${this.API_URL}/${materialId}/review`,
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
