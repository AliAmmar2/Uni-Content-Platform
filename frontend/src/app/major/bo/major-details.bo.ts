import { MajorDetailsModel } from '../../_clients/major/models/major-details.model';
import { CourseItemBo } from '../../courses/bo/course-item.bo';
import { FacultyItemBo } from '../../faculty/bo/faculty-item.bo';

export class MajorDetailsBo {
  id?: string;
  name: string;
  code: string;
  description?: string;

  faculty: FacultyItemBo;

  courses: CourseItemBo[] = [];

  totalCredits?: number;
  duration?: string;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: MajorDetailsModel) {
    this.id = model._id;
    this.name = model.name;
    this.code = model.code;
    this.description = model.description;

    this.faculty = model.faculty
      ? new FacultyItemBo(model.faculty)
      : null;

    this.courses = model.courses
      ? model.courses.map(c => new CourseItemBo(c))
      : [];

    this.totalCredits = model.totalCredits;
    this.duration = model.duration;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
