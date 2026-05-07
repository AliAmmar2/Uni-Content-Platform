import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { FacultyModel } from './models/faculty.model';
import { CreateFacultyFormGroupInterface } from '../../faculty/interfaces/create-faculty-form-group.interface';

@Injectable({ providedIn: 'root' })
export class FacultyClient {

  private readonly API_URL = 'http://localhost:5000/faculties';

  constructor(private http: HttpClient) {
  }

  public getFaculties(): Observable<Array<FacultyModel>> {
    return this.http.get<Array<FacultyModel>>(this.API_URL);
  }

  public createFaculty(
    faculty: CreateFacultyFormGroupInterface
  ): Observable<any> {
    return this.http.post(this.API_URL, faculty);
  }

  public updateFaculty(
    facultyId: string,
    faculty: CreateFacultyFormGroupInterface
  ): Observable<any> {
    return this.http.put(
      `${this.API_URL}/${facultyId}`,
      faculty
    );
  }

  public deleteFaculty(facultyId: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${facultyId}`
    );
  }
}
