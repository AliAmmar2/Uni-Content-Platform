import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';

import { CoursesAnnouncementModel } from '../../_clients/courses-announcements/models/courses-announcement.model';


import { CourseAnnouncementForCreationDto } from '../dtos/course-announcement-for-creation.dto';
import { CourseAnnouncementForUpdateDto } from '../dtos/course-announcement-for-update.dto';

import {
  CreateCourseAnnouncementFormGroupInterface
} from '../interfaces/create-course-announcement-form-group.interface';
import {
  UpdateCourseAnnouncementFormGroupInterface
} from '../interfaces/update-course-announcement-form-group.interface';
import { CourseAnnouncementItemBo } from '../bos/course-announcement-item.bo';
import { CourseAnnouncementClient } from '../../_clients/courses-announcements/course-announcement.client';

@Injectable({
  providedIn: 'root'
})
export class CoursesAnnouncementsService {

  constructor(
    private coursesAnnouncementClient: CourseAnnouncementClient
  ) {
  }

  public getCourseAnnouncements(
    courseId: string
  ): Observable<CourseAnnouncementItemBo[]> {
    return this.coursesAnnouncementClient
      .getCourseAnnouncements(courseId)
      .pipe(
        map((models: CoursesAnnouncementModel[]) =>
          _.map(
            models,
            model => new CourseAnnouncementItemBo(model)
          )
        )
      );
  }

  public createCourseAnnouncement(
    formValue: CreateCourseAnnouncementFormGroupInterface
  ): Observable<any> {
    const dto = new CourseAnnouncementForCreationDto(formValue);

    return this.coursesAnnouncementClient.createAnnouncement(dto);
  }

  public updateCourseAnnouncement(
    announcementId: string,
    formValue: UpdateCourseAnnouncementFormGroupInterface
  ): Observable<any> {
    const dto = new CourseAnnouncementForUpdateDto(formValue);

    return this.coursesAnnouncementClient.updateAnnouncement(
      announcementId,
      dto
    );
  }

  public deleteCourseAnnouncement(
    announcementId: string
  ): Observable<any> {
    return this.coursesAnnouncementClient.deleteAnnouncement(
      announcementId
    );
  }

  public getImageUploadSignature(
    filename: string,
    mimeType: string,
    fileSize: number
  ): Observable<any> {
    return this.coursesAnnouncementClient.getImageUploadSignature(
      filename,
      mimeType,
      fileSize
    );
  }

  public uploadImageToSupabase(
    signedUrl: string,
    file: File
  ): Observable<unknown> {
    return this.coursesAnnouncementClient.uploadImageToSupabase(
      signedUrl,
      file
    );
  }

  public getAnnouncementById(
    announcementId: string
  ): Observable<CourseAnnouncementItemBo> {
    return this.coursesAnnouncementClient
      .getAnnouncementById(announcementId)
      .pipe(
        map((model: CoursesAnnouncementModel) =>
          new CourseAnnouncementItemBo(model)
        )
      );
  }
}
