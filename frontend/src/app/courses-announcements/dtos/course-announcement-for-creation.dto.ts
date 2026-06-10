import { CreateCourseAnnouncementFormGroupInterface } from '../interfaces/create-course-announcement-form-group.interface';

export class CourseAnnouncementForCreationDto {

  title: string;
  content: string;

  courseId: string;

  imagePath?: string;
  imageMimeType?: string;
  imageOriginalFilename?: string;

  constructor(
    announcement: CreateCourseAnnouncementFormGroupInterface
  ) {
    this.title = announcement.title;
    this.content = announcement.content;

    this.courseId = announcement.courseId;

    this.imagePath = announcement.imagePath;
    this.imageMimeType = announcement.imageMimeType;
    this.imageOriginalFilename =
      announcement.imageOriginalFilename;
  }

  toJSON() {
    return {
      title: this.title,
      content: this.content,

      courseId: this.courseId,

      imagePath: this.imagePath,
      imageMimeType: this.imageMimeType,
      imageOriginalFilename:
      this.imageOriginalFilename
    };
  }
}
