import { CourseModel } from '../../course/models/course.model';

export type UploadedByModelType =
  | 'Student'
  | 'Admin';

export type MaterialApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

export interface UploadedByModel {
  _id: string;

  // STUDENT
  name?: string;
  universityEmail?: string;

  // ADMIN
  fullName?: string;
  email?: string;

  role?: string;
}

export interface MaterialModel {
  _id: string;

  title: string;
  description?: string;

  storagePath: string;
  originalFilename?: string;
  mimeType?: string;

  uploadedBy: string | UploadedByModel;

  uploadedByModel: UploadedByModelType;

  uploadedByName: string;

  course: string | CourseModel;

  approvalStatus: MaterialApprovalStatus;

  rejectionReason?: string;

  createdAt?: string;
  updatedAt?: string;
}
