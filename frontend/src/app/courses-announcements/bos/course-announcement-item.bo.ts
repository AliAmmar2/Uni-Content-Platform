import { CoursesAnnouncementModel } from '../../_clients/courses-announcements/models/courses-announcement.model';

export class CourseAnnouncementItemBo {
  id: string;

  title: string;
  content: string;

  courseName: string;

  postedByName: string;
  imagePath?: string;
  imageMimeType?: string;
  imageOriginalFilename?: string;

  imageUrl?: string | null;

  createdAt?: string;
  updatedAt?: string;

  constructor(model: CoursesAnnouncementModel) {
    this.id = model._id;

    this.title = model.title;
    this.content = model.content;

    this.courseName =
      typeof model.course === 'string'
        ? model.course
        : model.course?.name;

    this.postedByName = model.postedByName;


    this.imagePath = model.imagePath;
    this.imageMimeType = model.imageMimeType;
    this.imageOriginalFilename =
      model.imageOriginalFilename;

    this.imageUrl = model.imageUrl;

    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
