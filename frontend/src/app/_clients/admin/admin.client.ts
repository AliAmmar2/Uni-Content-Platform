import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminModel } from './models/admin.model';
import { AdminDetailsModel } from './models/admin-details.model';
import { CreateAdminFormGroupInterface } from '../../portal-admin/interfaces/create-admin-form-group.interface';
import { UpdateAdminFormGroupInterface } from '../../portal-admin/interfaces/update-admin-form-group.interface';

@Injectable({ providedIn: 'root' })
export class AdminClient {

  private readonly API_URL = 'http://localhost:5000/admins';

  constructor(private http: HttpClient) {}

  private getAuthOptions() {
    const token = localStorage.getItem('accessToken');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public getMe(): Observable<AdminDetailsModel> {
    return this.http.get<AdminDetailsModel>(
      `${this.API_URL}/me`,
      this.getAuthOptions()
    );
  }

  public getAdmins(): Observable<Array<AdminModel>> {
    return this.http.get<Array<AdminModel>>(
      this.API_URL,
      this.getAuthOptions()
    );
  }

  public getAdminById(adminId: string): Observable<AdminDetailsModel> {
    return this.http.get<AdminDetailsModel>(
      `${this.API_URL}/${adminId}`,
      this.getAuthOptions()
    );
  }

  public createAdmin(admin: CreateAdminFormGroupInterface): Observable<any> {
    return this.http.post(this.API_URL, admin, this.getAuthOptions());
  }

  public updateAdmin(adminId: string, admin: UpdateAdminFormGroupInterface): Observable<any> {
    return this.http.put(`${this.API_URL}/${adminId}`, admin, this.getAuthOptions());
  }

  public deleteAdmin(adminId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${adminId}`, this.getAuthOptions());
  }
}

