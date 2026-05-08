export interface CreateStudentFormGroupInterface {
  universityId: string;
  universityEmail: string;
  name: string;
  faculty: string;
  major: string;
  academicYear: number;
  calendarYear: number;
  role?: 'STUDENT' | 'MODERATOR';
  status?: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED';
}
