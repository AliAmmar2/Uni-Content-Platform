import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginFormInterface } from '../../login-page/interface/login-form.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class LoginClient {
  private readonly API_URL = 'http://localhost:5000/api/login'; // full URL

  constructor(private http: HttpClient) {
  }

  public login(loginFormValue: LoginFormInterface): Observable<any> {
    return this.http.post(this.API_URL, loginFormValue);
  }
}
