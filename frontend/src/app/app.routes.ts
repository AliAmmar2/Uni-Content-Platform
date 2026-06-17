import { Routes } from '@angular/router';
import { RegisterPage } from './reigister-page/register.page';
import { PortalAdminPage } from './portal-admin/portal-admin-page.component';
import { FacultyPage } from './portal-admin/faculty-page/faculty.page';
import { EditFacultyPage } from './portal-admin/edit-faculty-page/edit-faculty.page';
import { StudentsPage } from './portal-admin/students-page/students.page';
import { MajorPage } from './portal-admin/majors-page/major.page';
import { EditMajorPage } from './portal-admin/edit-major-page/edit-major.page';
import { MajorDetailsPage } from './portal-admin/major-details-page/major-details.page';
import { CoursesPage } from './portal-admin/courses-page/courses.page';
import { DashboardPage } from './portal-admin/dashboard-page/dashboard.page';
import { AccountSettingsPage } from './portal-admin/account-settings-page/account-settings.page';
import { EditStudentPage } from './portal-admin/edit-student-page/edit-student.page';
import { AdminsPage } from './portal-admin/admins-page/admins.page';
import { EditAdminPage } from './portal-admin/edit-admin-page/edit-admin.page';
import { EditCoursePage } from './portal-admin/edit-course-page/edit-course.page';
import { VerifyEmailPage } from './reigister-page/verify-email-page/verify-email.page';
import { CheckEmailPage } from './reigister-page/check-email-page/check-email.page';
import { StudentLoginPage } from './login-page/login-student-page/student-login.page';
import { AdminLoginPage } from './login-page/login-admin-page/admin-login.page';
import { StudentsPageComponent } from './student/students-page.component';
import { StudentCoursesPage } from './student/courses/student-courses.page';
import { ApprovedMaterialsPage } from './portal-admin/approved-materials/approved-materials.page';
import { UploadMaterialPage } from './portal-admin/upload-material/upload-material.page';
import { PendingMaterialsPage } from './portal-admin/pending-materials/pending-materials.page';
import { StudentsApprovedMaterialsPage } from './student/student-approved-materials/students-approved-materials.page';
import { UploadMaterialByStudentPage } from './student/upload-material-by-student/upload-material-by-student.page';
import { StudentPendingMaterialsPage } from './student/student-pending-materials/student-pending-materials.page';
import { StudentDashboardPage } from './student/student-dashboard/student-dashboard.page';
import { StudentAccountSettingsPage } from './student/student-account-settings-page/student-account-settings.page';
import { CourseAnnouncementsPage } from './portal-admin/course-announcements/course-announcements.page';
import { EditCourseAnnouncementsPage } from './portal-admin/edit-course-announcements/edit-course-announcements.page';
import {
  CourseAnnouncementDetailsPage
} from './portal-admin/course-announcement-details/course-announcement-details.page';
import { StudentCourseAnnouncementsPage } from './student/course-announcements/student-course-announcements.page';
import {
  StudentsCourseAnnouncementDetailsPage
} from './student/course-announcement-details/students-course-announcement-details.page';
import { StudentEditCourseAnnouncementsPage } from './student/edit-course-announcements/student-edit-course-announcements.page';
import { ResetPasswordPage } from './reset-password-page/reset-password.page';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: StudentLoginPage
  },
  {
    path: 'admin-@-access',
    component: AdminLoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'check-email',
    component: CheckEmailPage
  },
  {
    path: 'verify-email',
    component: VerifyEmailPage
  },
  {
    path: 'students/:universityId',
    component: StudentsPageComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: StudentDashboardPage
      },
      {
        path: 'courses',
        component: StudentCoursesPage
      },
      {
        path: 'account-settings',
        component: StudentAccountSettingsPage
      },
      {
        path: 'courses/:courseId/materials',
        component: StudentsApprovedMaterialsPage
      },
      {
        path: 'courses/:courseId/announcements',
        component: StudentCourseAnnouncementsPage
      },
      {
        path: 'courses/:courseId/announcements/create',
        component: StudentEditCourseAnnouncementsPage
      },
      {
        path: 'courses/:courseId/announcements/edit/:announcementId',
        component: StudentEditCourseAnnouncementsPage
      },
      {
        path: 'courses/:courseId/announcements/:announcementId',
        component: StudentsCourseAnnouncementDetailsPage
      },
      {
        path: 'courses/:courseId/upload-material',
        component: UploadMaterialByStudentPage
      },
      {
        path: 'courses/:courseId/pending-materials',
        component: StudentPendingMaterialsPage
      },
    ],
  },
  {
    path: 'students/:universityId/announcements',
    component: StudentDashboardPage
  },
  {
    path: 'admin/:id',
    component: PortalAdminPage,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'faculties',
        component: FacultyPage
      }
      , {
        path: 'admins',
        component: AdminsPage
      },
      {
        path: 'majors',
        component: MajorPage
      },
      {
        path: 'students',
        component: StudentsPage
      },
      {
        path: 'account-settings',
        component: AccountSettingsPage
      },
      {
        path: 'dashboard',
        component: DashboardPage
      },
      {
        path: 'courses',
        component: CoursesPage
      }
      ,
      {
        path: 'add-new-faculty',
        component: EditFacultyPage
      },
      {
        path: 'add-new-student',
        component: EditStudentPage
      },
      {
        path: 'add-new-admin',
        component: EditAdminPage
      },
      {
        path: 'add-new-course',
        component: EditCoursePage
      },
      {
        path: ':facultyId/edit-faculty',
        component: EditFacultyPage
      }
      , {
        path: ':studentId/edit-student',
        component: EditStudentPage
      },
      {
        path: ':adminId/edit-admin',
        component: EditAdminPage
      },

      {
        path: ':courseId/edit-course',
        component: EditCoursePage
      },
      {
        path: ':courseId/materials',
        component: ApprovedMaterialsPage
      },
      {
        path: 'courses/:courseId/upload-material',
        component: UploadMaterialPage
      },
      {
        path: 'courses/:courseId/announcements',
        component: CourseAnnouncementsPage
      },
      {
        path: 'courses/:courseId/announcement-details/:announcementId',
        component: CourseAnnouncementDetailsPage
      },
      {
        path: 'courses/:courseId/announcements/create',
        component: EditCourseAnnouncementsPage
      },
      {
        path: 'courses/:courseId/announcements/edit/:announcementId',
        component: EditCourseAnnouncementsPage
      },
      {
        path: 'courses/:courseId/pending-materials',
        component: PendingMaterialsPage
      },
      {
        path: ':majorId/add-new-course',
        component: EditCoursePage
      }
      ,
      {
        path: 'add-new-major',
        component: EditMajorPage
      },
      {
        path: ':majorId/edit-major',
        component: EditMajorPage
      },
      {
        path: ':majorId/details',
        component: MajorDetailsPage
      },
      {
  path: 'reset-password',
  component: ResetPasswordPage
}
    ]
  }
];
