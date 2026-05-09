import { CreateFacultyFormGroupInterface } from '../interfaces/create-faculty-form-group.interface';

export class FacultyForUpdateDto {

  name: string;
  code: string;
  description?: string;

  constructor(facultyFormValue: CreateFacultyFormGroupInterface) {
    this.name = facultyFormValue.name;
    this.code = facultyFormValue.code;
    this.description = facultyFormValue.description;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      description: this.description
    };
  }
}
