import { CreateMajorFormGroupInterface } from '../interfaces/create-major-form-group.interface';

export class MajorForCreationDto {

  name: string;
  code: string;
  faculty: string;
  description?: string;
  totalCredits?: number;
  duration?: string;


  constructor(formValue: CreateMajorFormGroupInterface) {
    this.name = formValue.name;
    this.code = formValue.code;
    this.faculty = formValue.faculty;
    this.description = formValue.description;
    this.totalCredits = formValue.totalCredits;
    this.duration = formValue.duration;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      faculty: this.faculty,
      description: this.description,
      totalCredits: this.totalCredits,
      duration: this.duration,
    };
  }
}
