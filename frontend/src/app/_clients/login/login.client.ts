import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginFormInterface } from '../../login-page/interface/login-form.interface';
import { HttpClient } from '@angular/common/http';
import { RegisterAdminFormInterface } from './register-admin-form.interface';

@Injectable({ providedIn: 'root' })

export class LoginClient {
  private readonly API_URL = 'http://localhost:5000/auth';

  public login(loginFormValue: LoginFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginFormValue);
  }

  constructor(private http: HttpClient) {
  }

  public register(
    registerFormValue: RegisterAdminFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, registerFormValue
    );
  }

  public verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-email`, { token });
  }

}
