import { FacultyModel } from '../../_clients/faculty/models/faculty.model';

export class FacultyItemBo {
  id?: string;
  name: string;
  code: string;
  description?: string;

  constructor(facultyModel: FacultyModel) {
    this.id = facultyModel._id;
    this.name = facultyModel.name;
    this.code = facultyModel.code;
    this.description = facultyModel.description;
  }
}
