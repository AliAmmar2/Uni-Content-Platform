import { MaterialModel } from '../../_clients/material/models/material.model';

export class MaterialItemBo {
  id: string;

  title: string;
  description?: string;

  storagePath: string;
  originalFilename?: string;
  mimeType?: string;

  uploadedByName: string;
  uploadedByModel: 'Student' | 'Admin';

  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;

  courseId: string;
  courseName?: string;
  courseCode?: string;

  createdAt?: string;
  updatedAt?: string;

  constructor(materialModel: MaterialModel) {
    this.id = materialModel._id;

    this.title = materialModel.title;
    this.description = materialModel.description;

    this.storagePath = materialModel.storagePath;
    this.originalFilename = materialModel.originalFilename;
    this.mimeType = materialModel.mimeType;

    this.uploadedByName = materialModel.uploadedByName;
    this.uploadedByModel = materialModel.uploadedByModel;

    this.approvalStatus = materialModel.approvalStatus;
    this.rejectionReason = materialModel.rejectionReason;

    if (typeof materialModel.course === 'string') {
      this.courseId = materialModel.course;
    } else {
      this.courseId = materialModel.course?._id;
      this.courseName = materialModel.course?.name;
      this.courseCode = materialModel.course?.code;
    }

    this.createdAt = materialModel.createdAt;
    this.updatedAt = materialModel.updatedAt;
  }
}
