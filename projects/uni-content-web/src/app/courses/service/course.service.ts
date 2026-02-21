import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CoursesDetailsBo } from '../bo/courses-details.bo';
import { CourseModel } from '../../_clients/course/models/course.model';
import { CourseClient } from '../../_clients/course/course.client';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private courseClient: CourseClient) {
  }

  public getCourses(academicYear: number, calendarYear: number): Observable<CoursesDetailsBo[]> {
    return this.courseClient
      .getCoursesByAcademicAndCalenderYear(academicYear, calendarYear)
      .pipe(
        map((courses: CourseModel[]) =>
          courses.map(course => new CoursesDetailsBo(course))
        )
      );
  }
}
