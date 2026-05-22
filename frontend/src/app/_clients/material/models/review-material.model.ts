export interface ReviewMaterialModel {
  approvalStatus: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}
