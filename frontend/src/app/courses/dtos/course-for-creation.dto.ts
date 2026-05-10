import { CreateCourseFormGroupInterface } from '../interfaces/create-course-form-group.interface';

export class CourseForCreationDto {

  name: string;
  code: string;
  description?: string;
  credits: number;

  major: string;

  academicYear: number;
  calendarYear: number;

  semester: 'SEM1' | 'SEM2';

  constructor(course: CreateCourseFormGroupInterface) {
    this.name = course.name;
    this.code = course.code;
    this.description = course.description;
    this.credits = course.credits;

    this.major = course.major;

    this.academicYear = course.academicYear;
    this.calendarYear = course.calendarYear;

    this.semester = course.semester;
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
