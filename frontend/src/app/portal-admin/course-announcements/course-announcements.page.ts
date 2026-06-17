import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';


import {
  COURSE_ANNOUNCEMENT_KEY,
  CourseAnnouncementsState
} from '../../courses-announcements/+state/course-announcement.reducer';
import {
  selectAllCourseAnnouncements,
  selectCourseAnnouncementDetails
} from '../../courses-announcements/+state/courses.selector';
import { CourseAnnouncementActions } from '../../courses-announcements/+state/courses-announcement.action';
import { DatePipe } from '@angular/common';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CourseAnnouncementItemBo } from '../../courses-announcements/bos/course-announcement-item.bo';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { CourseAnnouncementStatusEnum } from '../../courses-announcements/+state/enums/course-announcement-status.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-announcements',
  templateUrl: './course-announcements.page.html',
  imports: [
    DatePipe,
    LetDirective,
    FaIconComponent
  ],
  styleUrls: ['./course-announcements.page.scss']
})
export class CourseAnnouncementsPage implements OnInit {

  private router = inject(Router);
  private courseId: string;

  private activatedRoute = inject(ActivatedRoute);

  private store = inject(Store);
  public courseAnnouncementState$:
    Observable<CourseAnnouncementsState>;
  public courseAnnouncementDetailsSelected$ = this.store.pipe(
    select(selectCourseAnnouncementDetails)
  );
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);

  public readonly COURSE_ANNOUNCEMENT_KEY =
    COURSE_ANNOUNCEMENT_KEY;
  public adminId: string;

  private subscription$ = new Subscription();
  private toastr = inject(ToastrService);

  constructor() {
    this.courseAnnouncementState$ =
      this.store.select(selectAllCourseAnnouncements);
  }

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    this.courseId =
      this.activatedRoute.snapshot.paramMap.get('courseId');
    this.courseAnnouncementDetailsSubscription();
    if (this.courseId) {
      this.store.dispatch(
        CourseAnnouncementActions.loadCourseAnnouncements({
          courseId: this.courseId
        })
      );
    }
  }

  public createAnnouncement(): void {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses',
      this.courseId,
      'announcements',
      'create'
    ]);
  }

  public async presentPopoverActions($event: MouseEvent, announcement: CourseAnnouncementItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.navigateToEditAnnouncement(announcement.id)
        }
      },
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(announcement)

        }
      }
    ]);
  }

  public presentDeleteAlert(announcement: CourseAnnouncementItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Announcement?',
      message: announcement.title + ' will be permanently deleted!',
      action: [
        {
          label: 'Yes',
          color: ' #d40000',
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
    this.ngxMdDialogService.openMultiActionsDialog(matYesNoDialogData, { width: '400px' });
  }

  public deleteAnnouncement(id: string): void {
    this.store.dispatch(CourseAnnouncementActions.deleteCourseAnnouncement({
      announcementId: id,
      courseId: this.courseId
    }));
  }

  public courseAnnouncementDetailsSubscription() {
    this.subscription$.add(
      this.courseAnnouncementDetailsSelected$.subscribe((courseAnnouncementDetailsState) => {
          if (!courseAnnouncementDetailsState) {
            return;
          }
          if (courseAnnouncementDetailsState.status === CourseAnnouncementStatusEnum.deleteSuccess) {
            this.toastr.clear();

            this.toastr.success(
              'Faculty deleted successfully',
              'Success',
              {
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                timeOut: 3000
              }
            );

            return;
          }

          if (courseAnnouncementDetailsState.status === CourseAnnouncementStatusEnum.deleteFailure) {
            this.toastr.clear();

            this.toastr.error(
              courseAnnouncementDetailsState.error?.message || 'Something went wrong',
              'Error',
              {
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                timeOut: 4000
              }
            );
          }
        }
      ));
  }

  public navigateToEditAnnouncement(id: string): void {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses',
      this.courseId,
      'announcements',
      'edit',
      id
    ]);
  }

  public viewDetails(id: string): void {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses',
      this.courseId,
      'announcement-details',
      id
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

  public goToCoursesPage(): void {
    if (!this.adminId || !this.courseId) {
      return;
    }
    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses'
    ]);
  }
}
