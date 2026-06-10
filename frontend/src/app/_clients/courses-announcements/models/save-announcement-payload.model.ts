export interface SaveAnnouncementPayload {
  title: string;
  content: string;
  courseId: string;

  imagePath?: string;
  imageMimeType?: string;
  imageOriginalFilename?: string;
}
