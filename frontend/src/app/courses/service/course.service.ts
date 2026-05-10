import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';

import { CourseClient } from '../../_clients/course/course.client';
import { CourseModel } from '../../_clients/course/models/course.model';
import { CourseDetailsModel } from '../../_clients/course/models/course-details.model';

import { CourseItemBo } from '../bo/course-item.bo';
import { CourseDetailsBo } from '../bo/course-details.bo';

import { CourseForCreationDto } from '../dtos/course-for-creation.dto';
import { CourseForUpdateDto } from '../dtos/course-for-update.dto';

import { CreateCourseFormGroupInterface } from '../interfaces/create-course-form-group.interface';
import { UpdateCourseFormGroupInterface } from '../interfaces/update-course-form-group.interface';

@Injectable({ providedIn: 'root' })
export class CoursesService {

  constructor(private courseClient: CourseClient) {
  }

  public getCoursesFiltered(params?: {
    major?: string;
    academicYear?: number;
    calendarYear?: number;
  }): Observable<CourseItemBo[]> {

    return this.courseClient.getAllCoursesFiltered(params).pipe(
      map((models: CourseModel[]) =>
        _.map(models, m => new CourseItemBo(m))
      )
    );
  }

  public getAllCourses(): Observable<CourseItemBo[]> {
    return this.courseClient.getAllCourses().pipe(
      map((models: CourseModel[]) =>
        _.map(models, m => new CourseItemBo(m))
      )
    );
  }

  public getMyMajorCourses(): Observable<CourseItemBo[]> {
    return this.courseClient.getMyMajorCourses().pipe(
      map((models: CourseModel[]) =>
        _.map(models, m => new CourseItemBo(m))
      )
    );
  }

  public getCoursesByMajor(majorId: string): Observable<CourseItemBo[]> {
    return this.courseClient.getCoursesByMajor(majorId).pipe(
      map((models: CourseModel[]) =>
        _.map(models, m => new CourseItemBo(m))
      )
    );
  }

  public getCourseById(id: string): Observable<CourseDetailsBo> {
    return this.courseClient.getCourseById(id).pipe(
      map((model: CourseDetailsModel) =>
        new CourseDetailsBo(model)
      )
    );
  }

  public createCourse(formValue: CreateCourseFormGroupInterface): Observable<any> {
    const dto = new CourseForCreationDto(formValue);
    return this.courseClient.createCourse(dto);
  }

  public updateCourse(id: string, formValue: UpdateCourseFormGroupInterface): Observable<any> {
    const dto = new CourseForUpdateDto(formValue);
    return this.courseClient.updateCourse(id, dto);
  }

  public deleteCourse(id: string): Observable<any> {
    return this.courseClient.deleteCourse(id);
  }

  public getCourseMaterials(courseId: string): Observable<any> {
    return this.courseClient.getCourseMaterials(courseId);
  }
}
