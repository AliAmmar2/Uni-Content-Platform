export interface SaveMaterialPayload {
  title: string;
  description?: string;
  courseId: string;
  storagePath: string;
  originalFilename: string;
  mimeType: string;
}
