// import { Injectable } from '@angular/core';
// import { map, Observable } from 'rxjs';
// import { StudentModel } from './models/student.model';
// import { HttpClient } from '@angular/common/http';
//
// @Injectable({ providedIn: 'root' })
// export class StudentClient {
//   // private readonly API_URL = 'http://localhost:5000/api/students';
//   private readonly API_URL = 'assets/students.json';
//
//
//   constructor(private http: HttpClient) {
//   }
//
//   public getStudentById(universityId: string): Observable<StudentModel> {
//     console.log('Getting student by id:', universityId);
//     return this.http.get<StudentModel[]>(this.API_URL).pipe(
//       map((students) => {
//         const student = students.find(
//           (student) => student.universityId === universityId
//         );
//
//         console.log('Found student:', student);
//         if (!student) {
//           console.log('Student not found');
//         }
//
//         return student;
//       })
//     );
//   }
//
//   // public getStudentById(universityId: string): Observable<StudentModel> {
//   //   return this.http.get<StudentModel>(`${this.API_URL}/${universityId}`);
//   // }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StudentModel } from './models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentClient {

  private readonly API_URL = 'http://localhost:5000/students';

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

  public getStudents(): Observable<Array<StudentModel>> {
    return this.http.get<Array<StudentModel>>(
      this.API_URL,
      this.getAuthOptions()
    );
  }

  public getStudentById(id: string): Observable<StudentModel> {
    return this.http.get<StudentModel>(
      `${this.API_URL}/${id}`,
      this.getAuthOptions()
    );
  }

  public createStudent(student: any): Observable<any> {
    return this.http.post(
      this.API_URL,
      student,
      this.getAuthOptions()
    );
  }

  public updateStudent(
    id: string,
    student: any
  ): Observable<any> {
    return this.http.put(
      `${this.API_URL}/${id}`,
      student,
      this.getAuthOptions()
    );
  }

  public deleteStudent(id: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`,
      this.getAuthOptions()
    );
  }
}
