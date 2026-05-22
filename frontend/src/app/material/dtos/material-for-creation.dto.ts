import { CreateMaterialFormGroupInterface } from '../interfaces/create-material-form-group.interface';

export class MaterialForCreationDto {

  title: string;
  description?: string;
  courseId: string;
  file: File;

  constructor(materialFormValue: CreateMaterialFormGroupInterface) {

    this.title = materialFormValue.title;
    this.description = materialFormValue.description;
    this.courseId = materialFormValue.courseId;
    this.file = materialFormValue.file;

  }

  public toFormData(): FormData {

    const formData = new FormData();

    formData.append('title', this.title);

    formData.append(
      'description',
      this.description ?? ''
    );

    formData.append(
      'courseId',
      this.courseId
    );

    formData.append(
      'file',
      this.file
    );

    return formData;
  }
}
