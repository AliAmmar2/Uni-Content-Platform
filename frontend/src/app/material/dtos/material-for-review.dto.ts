import { ReviewMaterialFormGroupInterface } from '../interfaces/review-material-form-group.interface';

export class MaterialForReviewDto {
  approvalStatus: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;

  constructor(materialFormValue: ReviewMaterialFormGroupInterface) {
    this.approvalStatus = materialFormValue.approvalStatus;
    this.rejectionReason = materialFormValue.rejectionReason;
  }

  toJSON() {
    return {
      approvalStatus: this.approvalStatus,
      rejectionReason: this.rejectionReason
    };
  }
}
