import { FacultyModel } from '../../faculty/models/faculty.model';
import { CourseModel } from '../../course/models/course.model';

export interface MajorDetailsModel {
  _id?: string;
  name: string;
  code: string;
  description?: string;

  faculty: FacultyModel;

  courses: CourseModel[];
  totalCredits?: number;
  duration?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
