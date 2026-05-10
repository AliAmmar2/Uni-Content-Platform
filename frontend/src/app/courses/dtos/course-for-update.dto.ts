import { UpdateCourseFormGroupInterface } from '../interfaces/update-course-form-group.interface';

export class CourseForUpdateDto {

  name: string;
  code: string;
  description?: string;
  credits: number;

  major: string;

  academicYear: number;
  calendarYear: number;

  semester: 'SEM1' | 'SEM2';

  constructor(formValue: UpdateCourseFormGroupInterface) {
    this.name = formValue.name;
    this.code = formValue.code;
    this.description = formValue.description;
    this.credits = formValue.credits;

    this.major = formValue.major;

    this.academicYear = formValue.academicYear;
    this.calendarYear = formValue.calendarYear;

    this.semester = formValue.semester;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      description: this.description,
      credits: this.credits,
      major: this.major,
      academicYear: this.academicYear,
      calendarYear: this.calendarYear,
      semester: this.semester
    };
  }
}
