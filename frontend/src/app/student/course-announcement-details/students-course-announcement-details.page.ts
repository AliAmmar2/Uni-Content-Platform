import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LetDirective } from '@ngrx/component';
import { ToastrService } from 'ngx-toastr';

import { selectCourseAnnouncementDetails } from '../../courses-announcements/+state/courses.selector';

import { CourseAnnouncementActions } from '../../courses-announcements/+state/courses-announcement.action';

import {
  COURSE_ANNOUNCEMENT_DETAILS_KEY
} from '../../courses-announcements/+state/course-announcement-details.reducer';

@Component({
  standalone: true,
  selector: 'app-students-course-announcement-details',
  imports: [
    CommonModule,
    FontAwesomeModule,
    LetDirective
  ],
  templateUrl:
    './students-course-announcement-details.page.html',
  styleUrl:
    './students-course-announcement-details.page.scss'
})
export class StudentsCourseAnnouncementDetailsPage
  implements OnInit, OnDestroy {

  private store = inject(Store);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  public universityId: string | null = null;
  public courseId: string | null = null;
  public announcementId: string | null = null;

  public announcementDetailsSelected$ =
    this.store.pipe(select(selectCourseAnnouncementDetails));

  private subscription$ = new Subscription();

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {
  }

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      void this.router.navigate(['/login']);
      return;
    }

    this.universityId =
      this.activatedRoute.parent?.snapshot.paramMap.get(
        'universityId'
      );

    this.courseId =
      this.activatedRoute.snapshot.paramMap.get(
        'courseId'
      );

    this.announcementId =
      this.activatedRoute.snapshot.paramMap.get(
        'announcementId'
      );

    if (this.announcementId) {
      this.store.dispatch(
        CourseAnnouncementActions.loadCourseAnnouncementDetails({
          announcementId: this.announcementId
        })
      );
    }
  }

  public async downloadImage(
    imageUrl: string,
    filename?: string
  ): Promise<void> {

    try {

      this.toastr.success(
        'Image download started successfully',
        'Download Started',
        {
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          timeOut: 3000
        }
      );

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = blobUrl;
      link.download =
        filename || 'announcement-image';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {

      console.error(error);

      this.toastr.error(
        'Failed to download image',
        'Download Failed',
        {
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          timeOut: 4000
        }
      );
    }
  }

  public goToAnnouncementsPage(): void {

    if (!this.universityId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses',
      this.courseId,
      'announcements'
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

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  protected readonly COURSE_ANNOUNCEMENT_DETAILS_KEY =
    COURSE_ANNOUNCEMENT_DETAILS_KEY;
}
