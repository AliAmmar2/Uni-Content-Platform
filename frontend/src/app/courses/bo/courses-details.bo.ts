import { CourseModel } from '../../_clients/course/models/course.model';

export class CoursesDetailsBo {
  name: string;
  code: string;
  description?: string;
  credits: number;
  majorCode: string;
  academicYear: number;
  calendarYear: number;
  semester: 'SEM1' | 'SEM2';

  constructor(courseModel: CourseModel) {
    this.name = courseModel.name;
    this.code = courseModel.code;
    this.description = courseModel.description;
    this.credits = courseModel.credits;
    this.majorCode = courseModel.majorCode;
    this.academicYear = courseModel.academicYear;
    this.calendarYear = courseModel.calendarYear;
    this.semester = courseModel.semester;
  }
}
