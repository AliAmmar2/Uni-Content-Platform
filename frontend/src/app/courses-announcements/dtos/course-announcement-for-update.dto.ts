import { UpdateCourseAnnouncementFormGroupInterface } from '../interfaces/update-course-announcement-form-group.interface';

export class CourseAnnouncementForUpdateDto {

  title?: string;
  content?: string;

  imagePath?: string;
  imageMimeType?: string;
  imageOriginalFilename?: string;

  constructor(
    formValue: UpdateCourseAnnouncementFormGroupInterface
  ) {
    this.title = formValue.title;
    this.content = formValue.content;

    this.imagePath = formValue.imagePath;
    this.imageMimeType = formValue.imageMimeType;
    this.imageOriginalFilename =
      formValue.imageOriginalFilename;
  }

  toJSON() {
    return {
      title: this.title,
      content: this.content,

      imagePath: this.imagePath,
      imageMimeType: this.imageMimeType,
      imageOriginalFilename:
      this.imageOriginalFilename
    };
  }
}
