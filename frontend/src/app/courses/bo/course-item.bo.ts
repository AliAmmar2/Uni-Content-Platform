import { CourseModel } from '../../_clients/course/models/course.model';

export interface MajorInterface {
  id: string;
  name: string;
  code: string;
}

export class CourseItemBo {
  id: string;

  name: string;
  code: string;
  description?: string;
  credits: number;

  major: MajorInterface;

  academicYear: number;
  calendarYear: number;
  semester: 'SEM1' | 'SEM2';

  createdAt?: string;
  updatedAt?: string;

  constructor(courseModel: CourseModel) {
    this.id = courseModel._id;

    this.name = courseModel.name;
    this.code = courseModel.code;
    this.description = courseModel.description;
    this.credits = courseModel.credits;

    this.major = {
      id: courseModel.major?._id,
      name: courseModel.major?.name,
      code: courseModel.major?.code
    };

    this.academicYear = courseModel.academicYear;
    this.calendarYear = courseModel.calendarYear;
    this.semester = courseModel.semester;

    this.createdAt = courseModel.createdAt;
    this.updatedAt = courseModel.updatedAt;
  }
}
