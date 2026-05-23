import { StudentModel } from '../../_clients/student/models/student.model';

export class StudentDetailsBo {
	universityId: string;
	universityEmail: string;
	name: string;
	faculty: string;
  facultyId: string;
	major: string;
  majorId: string;
  majorCode: string;
	calendarYear: number;
	academicYear: number;
	role: string;
	status: string;

	constructor(studentModel: StudentModel) {
		this.universityEmail = studentModel.universityEmail;
		this.universityId = studentModel.universityId;
		this.faculty = studentModel.faculty.name;
    this.facultyId=studentModel.faculty._id;
		this.major = studentModel.major.name;
    this.majorId=studentModel.major._id;
    this.majorCode=studentModel.major.code;
		this.name = studentModel.name;
		this.calendarYear = studentModel.calendarYear ?? 2025;
		this.academicYear = studentModel.academicYear;
		this.role = studentModel.role;
		this.status = studentModel.status;
	}
}
