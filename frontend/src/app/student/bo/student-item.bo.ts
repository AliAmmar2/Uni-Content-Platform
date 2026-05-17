import { StudentModel } from '../../_clients/student/models/student.model';

export class StudentItemBo {
  id: string;
  universityId: string;
  universityEmail: string;
  name: string;
  faculty: string;
  major: string;
  academicYear: number;
  role: string;
  status: string;

  constructor(studentModel: StudentModel) {
    this.id = studentModel._id;
    this.universityEmail = studentModel.universityEmail;
    this.universityId = studentModel.universityId;
    this.faculty = studentModel?.faculty?.name ?? '';
    this.major = studentModel?.major?.name ?? '';
    this.name = studentModel.name;
    this.academicYear = studentModel.academicYear;
    this.role = studentModel.role;
    this.status = studentModel.status;
  }
}
