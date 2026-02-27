export interface CourseModel {
  _id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  majorCode: string;
  academicYear: number;
  calendarYear: number;
  semester: 'SEM1' | 'SEM2';
  createdAt?: string;
  updatedAt?: string;
}
