import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginAdminFormInterface } from '../../login-page/interface/login-admin-form.interface';

@Injectable({ providedIn: 'root' })

export class LoginAdminClient {
  private readonly API_URL = 'http://localhost:5000/admin';

  public login(loginFormValue: LoginAdminFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginFormValue);
  }

  constructor(private http: HttpClient) {
  }
}
