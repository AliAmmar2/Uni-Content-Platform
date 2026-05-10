import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CourseModel } from './models/course.model';
import { CourseDetailsModel } from './models/course-details.model';
import { CourseForUpdateDto } from '../../courses/dtos/course-for-update.dto';
import { CourseForCreationDto } from '../../courses/dtos/course-for-creation.dto';

@Injectable({ providedIn: 'root' })
export class CourseClient {

  private readonly API_URL = 'http://localhost:5000/courses';

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

  public getAllCoursesFiltered(params?: {
    major?: string;
    academicYear?: number;
    calendarYear?: number;
  }): Observable<CourseModel[]> {

    return this.http.get<CourseModel[]>(
      this.API_URL,
      {
        ...this.getAuthOptions(),
        params: params as any
      }
    );
  }

  public getAllCourses(): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(
      `${this.API_URL}/all`,
      this.getAuthOptions()
    );
  }

  public getCoursesByMajor(majorId: string): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(
      `${this.API_URL}/by-major/${majorId}`,
      this.getAuthOptions()
    );
  }

  public getMyMajorCourses(): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(
      `${this.API_URL}/my-major`,
      this.getAuthOptions()
    );
  }

  public getCourseById(id: string): Observable<CourseDetailsModel> {
    return this.http.get<CourseDetailsModel>(
      `${this.API_URL}/${id}`,
      this.getAuthOptions()
    );
  }

  public createCourse(dto: CourseForCreationDto): Observable<any> {
    return this.http.post(
      this.API_URL,
      dto,
      this.getAuthOptions()
    );
  }

  public updateCourse(id: string, dto: CourseForUpdateDto): Observable<any> {
    return this.http.put(
      `${this.API_URL}/${id}`,
      dto,
      this.getAuthOptions()
    );
  }

  public deleteCourse(id: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`,
      this.getAuthOptions()
    );
  }

  public getCourseMaterials(courseId: string): Observable<any> {
    return this.http.get(
      `${this.API_URL}/${courseId}/materials`,
      this.getAuthOptions()
    );
  }
}
