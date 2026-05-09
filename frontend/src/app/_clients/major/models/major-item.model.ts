import { FacultyModel } from "../../faculty/models/faculty.model";

export interface MajorModel {
  _id?: string;
  name: string;
  code: string;
  description?: string;

  faculty: FacultyModel;

  totalCredits?: number;
  duration?: string;
  courseCount?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
