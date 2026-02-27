import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StudentModel } from './models/student.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StudentClient {
  // private readonly API_URL = 'http://localhost:5000/api/students';
  private readonly API_URL = 'assets/students.json';


  constructor(private http: HttpClient) {
  }

  public getStudentById(universityId: string): Observable<StudentModel> {
    console.log('Getting student by id:', universityId);
    return this.http.get<StudentModel[]>(this.API_URL).pipe(
      map((students) => {
        const student = students.find(
          (student) => student.universityId === universityId
        );

        console.log('Found student:', student);
        if (!student) {
          console.log('Student not found');
        }

        return student;
      })
    );
  }

  // public getStudentById(universityId: string): Observable<StudentModel> {
  //   return this.http.get<StudentModel>(`${this.API_URL}/${universityId}`);
  // }
}
