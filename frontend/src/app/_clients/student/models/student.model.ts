export interface FacultyRef {
  _id: string;
  name?: string;
  code?: string;
}

export interface MajorRef {
  _id: string;
  name?: string;
  code?: string;
  faculty?: string;
}

export interface StudentModel {
  _id: string;

  universityId: string;
  universityEmail: string;
  name: string;

  faculty: FacultyRef | null;
  major: MajorRef;

  academicYear: number;
  calendarYear: number;

  role: 'STUDENT' | 'MODERATOR';
  status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED';

  loginAttempts?: number;
  lastLogin?: string;

  createdAt?: string;
  updatedAt?: string;
}
