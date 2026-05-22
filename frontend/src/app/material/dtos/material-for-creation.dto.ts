import { CreateMaterialFormGroupInterface } from '../interfaces/create-material-form-group.interface';
import { SaveMaterialPayload } from '../../_clients/material/models/save-material-payload.model';

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

  public toSavePayload(storagePath: string): SaveMaterialPayload {
    return {
      title: this.title,
      description: this.description,
      courseId: this.courseId,
      storagePath,
      originalFilename: this.file.name,
      mimeType: this.file.type
    };
  }
}
