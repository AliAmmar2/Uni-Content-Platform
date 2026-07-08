import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { map, Observable } from 'rxjs';

import { StudentClient } from '../../_clients/student/student.client';

import { StudentModel } from '../../_clients/student/models/student.model';

import { StudentItemBo } from '../bo/student-item.bo';
import { StudentDetailsBo } from '../bo/student-details.bo';

import { CreateStudentFormGroupInterface } from '../interfaces/create-student-form-group.interface';
import { UpdateStudentFormGroupInterface } from '../interfaces/update-student-form-group.interface';

import { StudentForCreationDto } from '../dtos/student-for-creation.dto';
import { StudentForUpdateDto } from '../dtos/student-for-update.dto';
import { UpdatePasswordBySuperadminDto } from '../dtos/update-password-by-superadmin.dto';
import {
  UpdatePasswordBySuperadminFormGroupInterface
} from '../interfaces/update-password-by-superadmin-form-group.interface';
import { UpdatePasswordDto } from '../../login-page/dto/update-password.dto';
import { UpdatePasswordFormInterface } from '../interfaces/update-password-form.interface';

@Injectable({ providedIn: 'root' })
export class StudentService {

  constructor(private studentClient: StudentClient) {
  }

  public getStudents(): Observable<Array<StudentItemBo>> {
    return this.studentClient
      .getStudents()
      .pipe(
        map((studentModels: Array<StudentModel>) => {
          return _.map(
            studentModels,
            studentModel => new StudentItemBo(studentModel)
          );
        })
      );
  }

  public getMe(): Observable<StudentDetailsBo> {
    return this.studentClient
      .getMe()
      .pipe(
        map((studentModel: StudentModel) => {
          return new StudentDetailsBo(studentModel);
        })
      );
  }

  public getStudentDetails(studentId: string): Observable<StudentDetailsBo> {
    return this.studentClient
      .getStudentById(studentId)
      .pipe(
        map((studentModel: StudentModel) => {
          return new StudentDetailsBo(studentModel);
        })
      );
  }

  public createStudent(
    studentFormValue: CreateStudentFormGroupInterface
  ): Observable<any> {

    const studentForCreationDto: StudentForCreationDto =
      new StudentForCreationDto(studentFormValue);

    return this.studentClient.createStudent(
      studentForCreationDto
    );
  }

  public updateStudent(
    studentId: string,
    studentFormValue: UpdateStudentFormGroupInterface
  ): Observable<any> {

    const studentForUpdateDto: StudentForUpdateDto =
      new StudentForUpdateDto(studentFormValue);

    return this.studentClient.updateStudent(
      studentId,
      studentForUpdateDto
    );
  }

  public deleteStudent(studentId: string): Observable<any> {
    return this.studentClient.deleteStudent(studentId);
  }

  public updatePasswordBySuperAdmin(
    studentId: string,
    formValue: UpdatePasswordBySuperadminFormGroupInterface
  ): Observable<any> {
    const updatePasswordDto = new UpdatePasswordBySuperadminDto(formValue);

    return this.studentClient.updatePasswordBySuperAdmin(
      studentId,
      updatePasswordDto
    );
  }

  public updatePassword(updatePasswordFormValue: UpdatePasswordFormInterface) {
    const updatePasswordDto = new UpdatePasswordDto(
      updatePasswordFormValue
    );

    return this.studentClient.updatePassword(
      updatePasswordDto.toJSON()
    );
  }

  public forgotPassword(
    universityEmail: string
  ): Observable<any> {
    return this.studentClient.forgotPassword(
      universityEmail
    );
  }

  public resetPassword(payload: { token: string; password: string }) {
    return this.studentClient.resetPassword(payload);
  }

  public getEmailByUniversityId(universityId: string) {
    return this.studentClient.getEmailByUniversityId(universityId);
  }
}
