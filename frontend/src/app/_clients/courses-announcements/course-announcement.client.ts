import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SaveAnnouncementPayload } from './models/save-announcement-payload.model';
import { AnnouncementUploadSignatureResponseModel } from './models/announcement-upload-signature-response.model';
import { CoursesAnnouncementModel } from './models/courses-announcement.model';

export interface AnnouncementResponseModel {
  message: string;
  announcement: CoursesAnnouncementModel;
}

@Injectable({
  providedIn: 'root'
})
export class CourseAnnouncementClient {

  private readonly API_URL = 'http://localhost:5000/announcementCourses';

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

  public getImageUploadSignature(
    filename: string,
    mimeType: string,
    fileSize: number
  ): Observable<AnnouncementUploadSignatureResponseModel> {
    return this.http.get<AnnouncementUploadSignatureResponseModel>(
      `${this.API_URL}/image-upload-signature`,
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

  public uploadImageToSupabase(
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

  public createAnnouncement(
    payload: SaveAnnouncementPayload
  ): Observable<AnnouncementResponseModel> {
    return this.http.post<AnnouncementResponseModel>(
      `${this.API_URL}`,
      payload,
      this.getAuthOptions()
    );
  }

  public getCourseAnnouncements(
    courseId: string
  ): Observable<CoursesAnnouncementModel[]> {
    return this.http.get<CoursesAnnouncementModel[]>(
      `${this.API_URL}/course/${courseId}`,
      this.getAuthOptions()
    );
  }

  public updateAnnouncement(
    announcementId: string,
    payload: Partial<SaveAnnouncementPayload>
  ): Observable<AnnouncementResponseModel> {
    return this.http.put<AnnouncementResponseModel>(
      `${this.API_URL}/${announcementId}`,
      payload,
      this.getAuthOptions()
    );
  }

  public deleteAnnouncement(
    announcementId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.API_URL}/${announcementId}`,
      this.getAuthOptions()
    );
  }

  public getAnnouncementById(
    announcementId: string
  ): Observable<CoursesAnnouncementModel> {
    return this.http.get<CoursesAnnouncementModel>(
      `${this.API_URL}/${announcementId}`,
      this.getAuthOptions()
    );
  }
}
