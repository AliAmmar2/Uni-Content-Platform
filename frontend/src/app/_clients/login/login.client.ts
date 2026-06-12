import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginFormInterface } from '../../login-page/interface/login-form.interface';
import { HttpClient } from '@angular/common/http';
import { RegisterAdminFormInterface } from './register-admin-form.interface';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })

export class LoginClient {
  private readonly API_URL = `${environment.apiUrl}/auth`;

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
