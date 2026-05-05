import { Injectable } from '@angular/core';
import { StudentClient } from '../../_clients/student/student.client';
import { map } from 'rxjs';
import { StudentModel } from '../../_clients/student/models/student.model';
import { StudentDetailsBo } from '../bo/student-details.bo';

@Injectable({ providedIn: 'root' })
export class StudentService {
  constructor(private studentClient: StudentClient) {
  }

  public getStudentDetails(id: string) {
    return this.studentClient
      .getStudentById(id)
      .pipe(
        map((studentModel: StudentModel) => {
          return new StudentDetailsBo(studentModel);
        })
      );
  }
}
