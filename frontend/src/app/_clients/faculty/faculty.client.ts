// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
//
// import { Observable } from 'rxjs';
//
// import { FacultyModel } from './models/faculty.model';
// import { CreateFacultyFormGroupInterface } from '../../faculty/interfaces/create-faculty-form-group.interface';
//
// @Injectable({ providedIn: 'root' })
// export class FacultyClient {
//
//   private readonly API_URL = 'http://localhost:5000/faculties';
//
//   private authHeaders(token: string): { headers: HttpHeaders } {
//     return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
//   }
//
//   constructor(private http: HttpClient) {
//   }
//
//   public getFaculties(): Observable<Array<FacultyModel>> {
//     return this.http.get<Array<FacultyModel>>(this.API_URL);
//   }
//
//   public createFaculty(
//     faculty: CreateFacultyFormGroupInterface
//   ): Observable<any> {
//     return this.http.post(this.API_URL, faculty);
//   }
//
//   public updateFaculty(
//     facultyId: string,
//     faculty: CreateFacultyFormGroupInterface
//   ): Observable<any> {
//     return this.http.put(
//       `${this.API_URL}/${facultyId}`,
//       faculty
//     );
//   }
//
//   public deleteFaculty(facultyId: string): Observable<any> {
//     return this.http.delete(
//       `${this.API_URL}/${facultyId}`
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FacultyModel } from './models/faculty.model';
import { CreateFacultyFormGroupInterface } from '../../faculty/interfaces/create-faculty-form-group.interface';

@Injectable({ providedIn: 'root' })
export class FacultyClient {

  private readonly API_URL = 'http://localhost:5000/faculties';

  constructor(private http: HttpClient) {}

  private getAuthOptions() {
    const token = localStorage.getItem('accessToken');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public getFaculties(): Observable<Array<FacultyModel>> {
    return this.http.get<Array<FacultyModel>>(
      this.API_URL,
      this.getAuthOptions()
    );
  }

  public createFaculty(
    faculty: CreateFacultyFormGroupInterface
  ): Observable<any> {
    return this.http.post(
      this.API_URL,
      faculty,
      this.getAuthOptions()
    );
  }

  public updateFaculty(
    facultyId: string,
    faculty: CreateFacultyFormGroupInterface
  ): Observable<any> {
    return this.http.put(
      `${this.API_URL}/${facultyId}`,
      faculty,
      this.getAuthOptions()
    );
  }

  public deleteFaculty(facultyId: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${facultyId}`,
      this.getAuthOptions()
    );
  }
}
