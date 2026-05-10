export interface UpdateCourseFormGroupInterface {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;

  major?: string;

  academicYear: number;
  calendarYear: number;

  semester: 'SEM1' | 'SEM2';
}
