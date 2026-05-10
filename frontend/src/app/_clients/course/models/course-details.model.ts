export interface MajorMiniModel {
  _id: string;
  name: string;
  code: string;
}

export interface CourseDetailsModel {
  _id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;

  major: MajorMiniModel;

  academicYear: number;
  calendarYear: number;
  semester: 'SEM1' | 'SEM2';

  createdAt?: string;
  updatedAt?: string;
}
