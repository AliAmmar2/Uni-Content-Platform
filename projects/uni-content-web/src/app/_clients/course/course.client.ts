import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CourseModel } from './models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseClient {

  private readonly API_URL = 'assets/courses.json';

  constructor(private http: HttpClient) {
  }

  public getCoursesByAcademicAndCalenderYear(
    academicYear: number,
    calendarYear: number
  ): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(this.API_URL).pipe(
      map((courses) =>
        courses.filter(course =>
          course.academicYear === academicYear &&
          course.calendarYear === calendarYear
        )
      )
    );
  }
}
