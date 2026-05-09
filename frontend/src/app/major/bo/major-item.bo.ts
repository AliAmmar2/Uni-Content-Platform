import { MajorModel } from '../../_clients/major/models/major-item.model';
import { FacultyItemBo } from '../../faculty/bo/faculty-item.bo';

export class MajorItemBo {
  id?: string;
  name: string;
  code: string;
  description?: string;
  totalCredits?: number;
  duration?: string;

  faculty: FacultyItemBo;

  courseCount?: number;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: MajorModel) {
    this.id = model._id;
    this.name = model.name;
    this.code = model.code;
    this.description = model.description;

    this.faculty = model.faculty
      ? new FacultyItemBo(model.faculty)
      : null;

    this.courseCount = model.courseCount;

    this.totalCredits = model.totalCredits;
    this.duration = model.duration;

    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
