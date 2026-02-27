import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginFormInterface } from '../../login-page/interface/login-form.interface';
import { HttpClient } from '@angular/common/http';
import { StudentModel } from '../student/models/student.model';
import { RegisterFormInterface } from '../../reigister-page/interface/register-form.interface';

@Injectable({ providedIn: 'root' })

export class LoginClient {
  // private readonly API_URL = 'http://localhost:5000/api/auth/login'; // full URL
  private readonly API_URL = 'assets/students.json';

  constructor(private http: HttpClient) {
  }

  public login(loginFormValue: LoginFormInterface): Observable<StudentModel | null> {
    return this.http.get<StudentModel[]>(this.API_URL).pipe(
      map((students) => {
        const matchedStudent = students.find(
          s =>
            s.universityId === loginFormValue.universityId &&
            s.universityEmail === loginFormValue.email &&
            s.password === loginFormValue.password
        );
        return matchedStudent || null;
      })
    );
  }

  // public login(loginFormValue: LoginFormInterface): Observable<any> {
  //   return this.http.post(`${this.API_URL}/login`, loginFormValue);
  // }

  public register(registerFormValue: RegisterFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, registerFormValue);
  }
}
