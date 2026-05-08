import { StudentModel } from '../../_clients/student/models/student.model';

export class StudentDetailsBo {
	universityId: string;
	universityEmail: string;
	name: string;
	faculty: string;
	major: string;
	calendarYear: number;
	academicYear: number;
	role: string;
	status: string;

	constructor(studentModel: StudentModel) {
		this.universityEmail = studentModel.universityEmail;
		this.universityId = studentModel.universityId;
		this.faculty = studentModel.faculty.name;
		this.major = studentModel.major.name;
		this.name = studentModel.name;
		this.calendarYear = studentModel.calendarYear ?? 2025;
		this.academicYear = studentModel.academicYear;
		this.role = studentModel.role;
		this.status = studentModel.status;
	}
}
