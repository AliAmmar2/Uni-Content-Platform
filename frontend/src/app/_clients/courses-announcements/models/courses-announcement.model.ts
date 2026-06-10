import { CourseModel } from '../../course/models/course.model';

export type PostedByModelType =
  | 'Student'
  | 'Admin';

export interface PostedByModel {
  _id: string;

  // STUDENT
  name?: string;
  universityEmail?: string;

  // ADMIN
  fullName?: string;
  email?: string;

  role?: string;
}

export interface CoursesAnnouncementModel {
  _id: string;

  title: string;
  content: string;

  course: string | CourseModel;

  postedBy: string | PostedByModel;
  postedByName: string;

  postedByModel: PostedByModelType;

  imagePath?: string;
  imageMimeType?: string;
  imageOriginalFilename?: string;

  imageUrl?: string | null;

  createdAt?: string;
  updatedAt?: string;
}
