import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginAdminFormInterface } from '../../login-page/interface/login-admin-form.interface';
import { UpdatePasswordFormInterface } from '../../login-page/interface/update-password-form.interface';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })

export class LoginAdminClient {
  private readonly API_URL = `${environment.apiUrl}/admin`;

  private getAuthOptions() {
    const token = localStorage.getItem('accessToken');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public login(loginFormValue: LoginAdminFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginFormValue);
  }

  public updatePassword(updateFormValue: UpdatePasswordFormInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/update-password`,
      updateFormValue,
      this.getAuthOptions());
  }

  constructor(private http: HttpClient) {
  }
}
