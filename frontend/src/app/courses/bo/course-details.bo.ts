import { CourseDetailsModel } from '../../_clients/course/models/course-details.model';

export class CourseDetailsBo {
  name: string;
  code: string;
  description?: string;
  credits: number;
  majorCode: string;
  majorName: string;
  academicYear: number;
  calendarYear: number;
  semester: 'SEM1' | 'SEM2';

  constructor(courseModel: CourseDetailsModel) {
    this.name = courseModel.name;
    this.code = courseModel.code;
    this.description = courseModel.description;
    this.credits = courseModel.credits;

    this.majorCode = courseModel.major?.code;
    this.majorName = courseModel.major?.name;

    this.academicYear = courseModel.academicYear;
    this.calendarYear = courseModel.calendarYear;
    this.semester = courseModel.semester;
  }
}
