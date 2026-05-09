import { UpdateStudentFormGroupInterface } from '../interfaces/update-student-form-group.interface';

export class StudentForUpdateDto {

  universityId?: string;
  universityEmail?: string;
  name?: string;
  faculty?: string;
  major?: string;
  academicYear?: number;
  calendarYear?: number;
  role?: 'STUDENT' | 'MODERATOR';
  status?: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED';

  constructor(studentFormValue: UpdateStudentFormGroupInterface) {
    this.universityId = studentFormValue.universityId;
    this.universityEmail = studentFormValue.universityEmail;
    this.name = studentFormValue.name;
    this.faculty = studentFormValue.faculty;
    this.major = studentFormValue.major;
    this.academicYear = studentFormValue.academicYear;
    this.calendarYear = studentFormValue.calendarYear;
    this.role = studentFormValue.role;
    this.status = studentFormValue.status;
  }

  toJSON() {
    return {
      universityId: this.universityId,
      universityEmail: this.universityEmail,
      name: this.name,
      faculty: this.faculty,
      major: this.major,
      academicYear: this.academicYear,
      calendarYear: this.calendarYear,
      role: this.role,
      status: this.status
    };
  }
}
