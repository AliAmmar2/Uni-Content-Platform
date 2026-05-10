import { FacultyDetailsModel } from '../../_clients/faculty/models/faculty-details.model';

export class FacultyDetailsBo {
  id?: string;
  name: string;
  code: string;
  description?: string;

  constructor(facultyModel: FacultyDetailsModel) {
    this.id = facultyModel._id;
    this.name = facultyModel.name;
    this.code = facultyModel.code;
    this.description = facultyModel.description;
  }
}
