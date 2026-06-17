import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

import {
  COURSE_ANNOUNCEMENT_KEY,
  CourseAnnouncementsState
} from '../../courses-announcements/+state/course-announcement.reducer';

import {
  selectAllCourseAnnouncements,
  selectCourseAnnouncementDetails
} from '../../courses-announcements/+state/courses.selector';

import { CourseAnnouncementActions } from '../../courses-announcements/+state/courses-announcement.action';
import { CourseAnnouncementItemBo } from '../../courses-announcements/bos/course-announcement-item.bo';
import { CourseAnnouncementStatusEnum } from '../../courses-announcements/+state/enums/course-announcement-status.enum';

import { StudentActions } from '../../student/+state/student.action';
import { selectStudentDetails } from '../../student/+state/student.selector';
import { LOGGED_IN_STUDENT_KEY } from '../../student/+state/student-details.reducer';

import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';

@Component({
  standalone: true,
  selector: 'app-student-course-announcements',
  templateUrl: './student-course-announcements.page.html',
  styleUrls: ['./student-course-announcements.page.scss'],
  imports: [
    DatePipe,
    LetDirective,
    FaIconComponent
  ]
})
export class StudentCourseAnnouncementsPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);
  private toastr = inject(ToastrService);
  private popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);

  public universityId: string | null = null;
  public courseId: string | null = null;
  public isModerator = false;

  public courseAnnouncementState$: Observable<CourseAnnouncementsState>;

  public courseAnnouncementDetailsSelected$ =
    this.store.pipe(select(selectCourseAnnouncementDetails));

  public studentDetailsSelected$ =
    this.store.pipe(select(selectStudentDetails));

  private subscription$ = new Subscription();

  public readonly COURSE_ANNOUNCEMENT_KEY =
    COURSE_ANNOUNCEMENT_KEY;

  constructor() {
    this.courseAnnouncementState$ =
      this.store.select(selectAllCourseAnnouncements);
  }

  ngOnInit(): void {
    this.universityId =
      this.activatedRoute.parent?.snapshot.paramMap.get('universityId') ??
      this.activatedRoute.snapshot.paramMap.get('universityId');

    this.courseId =
      this.activatedRoute.snapshot.paramMap.get('courseId') ??
      this.activatedRoute.parent?.snapshot.paramMap.get('courseId');

    this.store.dispatch(StudentActions.loadMe());

    this.studentDetailsSubscription();
    this.courseAnnouncementDetailsSubscription();
    this.loadAnnouncements();
  }

  private studentDetailsSubscription(): void {
    this.subscription$.add(
      this.studentDetailsSelected$.subscribe(studentState => {
        const loggedInStudent = studentState?.[LOGGED_IN_STUDENT_KEY];

        this.isModerator = loggedInStudent?.role === 'MODERATOR';
      })
    );
  }

  private courseAnnouncementDetailsSubscription(): void {
    this.subscription$.add(
      this.courseAnnouncementDetailsSelected$.subscribe(state => {
        if (!state) {
          return;
        }

        if (state.status === CourseAnnouncementStatusEnum.deleteSuccess) {
          this.toastr.clear();

          this.toastr.success(
            'Announcement deleted successfully',
            'Success',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );

          this.store.dispatch(
            CourseAnnouncementActions.resetCourseAnnouncementState()
          );
        }

        if (state.status === CourseAnnouncementStatusEnum.deleteFailure) {
          this.toastr.clear();

          this.toastr.error(
            state.error?.message || 'Something went wrong',
            'Error',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 4000
            }
          );

          this.store.dispatch(
            CourseAnnouncementActions.resetCourseAnnouncementState()
          );
        }
      })
    );
  }

  public loadAnnouncements(): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      CourseAnnouncementActions.loadCourseAnnouncements({
        courseId: this.courseId
      })
    );
  }

  public createAnnouncement(): void {
    if (!this.isModerator || !this.universityId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses',
      this.courseId,
      'announcements',
      'create'
    ]);
  }

  public presentPopoverActions(
    event: MouseEvent,
    announcement: CourseAnnouncementItemBo
  ): void {
    if (!this.isModerator) {
      return;
    }

    this.popoverBoxService.openPanel(event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.navigateToEditAnnouncement(announcement.id);
        }
      },
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(announcement);
        }
      }
    ]);
  }

  public presentDeleteAlert(
    announcement: CourseAnnouncementItemBo
  ): void {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Announcement?',
      message: announcement.title + ' will be permanently deleted!',
      action: [
        {
          label: 'Yes',
          color: '#d40000',
          handler: () => {
            this.deleteAnnouncement(announcement.id);
          }
        },
        {
          label: 'Cancel',
          color: '#88a5db',
          handler: () => {
          }
        }
      ]
    };

    this.ngxMdDialogService.openMultiActionsDialog(
      matYesNoDialogData,
      { width: '400px' }
    );
  }

  public deleteAnnouncement(id: string): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      CourseAnnouncementActions.deleteCourseAnnouncement({
        announcementId: id,
        courseId: this.courseId
      })
    );
  }

  public navigateToEditAnnouncement(id: string): void {
    if (!this.isModerator || !this.universityId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses',
      this.courseId,
      'announcements',
      'edit',
      id
    ]);
  }

  public viewDetails(id: string): void {
    if (!this.universityId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses',
      this.courseId,
      'announcements',
      id
    ]);
  }

  public goToCoursesPage(): void {
    if (!this.universityId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses'
    ]);
  }

  public getInitials(name: string): string {
    if (!name) {
      return 'NA';
    }

    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
