import { StudentModel } from '../../_clients/student/models/student.model';

export class StudentItemBo {
  universityId: string;
  universityEmail: string;
  name: string;
  faculty: string;
  major: string;
  academicYear: number;
  roles: string[];
  status: string;

  constructor(studentModel: StudentModel) {
    this.universityEmail = studentModel.universityEmail;
    this.universityId = studentModel.universityId;
    this.faculty = studentModel.faculty;
    this.major = studentModel.major;
    this.name = studentModel.name;
    this.academicYear = studentModel.academicYear;
    this.roles = studentModel.roles;
    this.status = studentModel.status;
  }
}
