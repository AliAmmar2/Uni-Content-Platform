import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MajorModel } from './models/major-item.model';
import { MajorDetailsModel } from './models/major-details.model';

@Injectable({ providedIn: 'root' })
export class MajorClient {

  private readonly API_URL = 'http://localhost:5000/majors';

  constructor(private http: HttpClient) {}

  private getAuthOptions() {
    const token = localStorage.getItem('accessToken');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public getMajors(): Observable<MajorModel[]> {
    return this.http.get<MajorModel[]>(
      this.API_URL,
      this.getAuthOptions()
    );
  }

  public getMajorById(id: string): Observable<MajorDetailsModel> {
    return this.http.get<MajorDetailsModel>(
      `${this.API_URL}/${id}`,
      this.getAuthOptions()
    );
  }

  public createMajor(dto: any): Observable<any> {
    return this.http.post(
      this.API_URL,
      dto,
      this.getAuthOptions()
    );
  }

  public updateMajor(id: string, dto: any): Observable<any> {
    return this.http.put(
      `${this.API_URL}/${id}`,
      dto,
      this.getAuthOptions()
    );
  }

  public deleteMajor(id: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`,
      this.getAuthOptions()
    );
  }
}
