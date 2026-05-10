export interface CreateCourseFormGroupInterface {
  name: string;
  code: string;
  description?: string;
  credits: number;

  major: string; // majorId

  academicYear: number;
  calendarYear: number;

  semester: 'SEM1' | 'SEM2';
}
