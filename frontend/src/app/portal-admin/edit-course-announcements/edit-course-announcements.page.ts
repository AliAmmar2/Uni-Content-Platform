import {
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CourseAnnouncementActions } from '../../courses-announcements/+state/courses-announcement.action';
import { selectCourseAnnouncementDetails } from '../../courses-announcements/+state/courses.selector';
import { CourseAnnouncementStatusEnum } from '../../courses-announcements/+state/enums/course-announcement-status.enum';
import { COURSE_ANNOUNCEMENT_DETAILS_KEY } from '../../courses-announcements/+state/course-announcement-details.reducer';

import { CoursesAnnouncementsService } from '../../courses-announcements/service/course-announcement.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './edit-course-announcements.page.html',
  styleUrl: './edit-course-announcements.page.scss'
})
export class EditCourseAnnouncementsPage implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  private coursesAnnouncementsService =
    inject(CoursesAnnouncementsService);

  public announcementForm: FormGroup;

  public adminId: string | null = null;
  public courseId: string | null = null;
  public announcementId: string | null = null;

  public isEditMode = false;

  public selectedImage: File | null = null;
  public selectedImageName: string | null = null;

  public currentImageUrl: string | null = null;
  public currentImageName: string | null = null;

  public isSubmitting = false;

  private subscription$ = new Subscription();

  public courseAnnouncementDetailsSelected$ =
    this.store.pipe(select(selectCourseAnnouncementDetails));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.announcementForm = new FormGroup({
      title: new FormControl('', Validators.required),
      courseId: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      void this.router.navigate(['/admin-@-access']);
      return;
    }

    this.adminId =
      this.activatedRoute.parent?.snapshot.paramMap.get('id');

    this.courseId =
      this.activatedRoute.snapshot.paramMap.get('courseId');

    this.announcementId =
      this.activatedRoute.snapshot.paramMap.get('announcementId');

    this.isEditMode = !!this.announcementId;

    if (this.courseId) {
      this.announcementForm.patchValue({
        courseId: this.courseId
      });
    }

    this.courseAnnouncementSubscription();

    if (this.isEditMode && this.announcementId) {
      this.store.dispatch(
        CourseAnnouncementActions.loadCourseAnnouncementDetails({
          announcementId: this.announcementId
        })
      );
    }
  }

  private courseAnnouncementSubscription(): void {
    this.subscription$.add(
      this.courseAnnouncementDetailsSelected$.subscribe({
        next: (announcementDetailsState) => {
          if (!announcementDetailsState?.status) {
            return;
          }

          if (
            announcementDetailsState.status ===
            CourseAnnouncementStatusEnum.createSuccess
          ) {
            this.toastr.clear();
            this.toastr.success(
              'Announcement created successfully',
              'Success',
              {
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                timeOut: 4000
              }
            );

            this.goToAnnouncementsPage();
            return;
          }

          if (
            announcementDetailsState.status ===
            CourseAnnouncementStatusEnum.updateSuccess
          ) {
            this.toastr.clear();
            this.toastr.success(
              'Announcement updated successfully',
              'Success',
              {
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                timeOut: 4000
              }
            );

            this.goToAnnouncementsPage();
            return;
          }

          if (
            announcementDetailsState.status ===
            CourseAnnouncementStatusEnum.createFailure ||
            announcementDetailsState.status ===
            CourseAnnouncementStatusEnum.updateFailure
          ) {
            this.isSubmitting = false;

            this.toastr.clear();
            this.toastr.error(
              announcementDetailsState.error?.message ||
              'Something went wrong',
              'Error',
              {
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                timeOut: 4000
              }
            );

            return;
          }

          if (
            this.isEditMode &&
            announcementDetailsState.status ===
            CourseAnnouncementStatusEnum.loadDetailsSuccess
          ) {
            const announcement =
              announcementDetailsState[COURSE_ANNOUNCEMENT_DETAILS_KEY];

            if (!announcement) {
              return;
            }

            this.announcementForm.patchValue({
              title: announcement.title,
              content: announcement.content,
              courseId: this.courseId
            });

            this.currentImageUrl = announcement.imageUrl || null;
            this.currentImageName =
              announcement.imageOriginalFilename || null;
          }
        }
      })
    );
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedImage = file;
    this.selectedImageName = file.name;
  }

  public onSubmit(): void {
    if (this.announcementForm.invalid || this.isSubmitting) {
      this.announcementForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.announcementForm.value;

    const announcement = {
      title: formValue.title,
      content: formValue.content,
      courseId: formValue.courseId
    };

    if (!this.selectedImage) {
      if (this.isEditMode && this.announcementId && this.courseId) {
        this.store.dispatch(
          CourseAnnouncementActions.updateCourseAnnouncement({
            announcementId: this.announcementId,
            courseId: this.courseId,
            announcement
          })
        );

        return;
      }

      this.store.dispatch(
        CourseAnnouncementActions.createCourseAnnouncement({
          announcement
        })
      );

      return;
    }

    this.subscription$.add(
      this.coursesAnnouncementsService
        .getImageUploadSignature(
          this.selectedImage.name,
          this.selectedImage.type,
          this.selectedImage.size
        )
        .pipe(
          switchMap((signature) =>
            this.coursesAnnouncementsService
              .uploadImageToSupabase(
                signature.signedUrl,
                this.selectedImage as File
              )
              .pipe(
                switchMap(() => {
                  const announcementWithImage = {
                    ...announcement,
                    imagePath: signature.imagePath,
                    imageMimeType: this.selectedImage?.type,
                    imageOriginalFilename: this.selectedImage?.name
                  };

                  if (
                    this.isEditMode &&
                    this.announcementId &&
                    this.courseId
                  ) {
                    this.store.dispatch(
                      CourseAnnouncementActions
                        .updateCourseAnnouncement({
                          announcementId: this.announcementId,
                          courseId: this.courseId,
                          announcement: announcementWithImage
                        })
                    );
                  } else {
                    this.store.dispatch(
                      CourseAnnouncementActions
                        .createCourseAnnouncement({
                          announcement: announcementWithImage
                        })
                    );
                  }

                  return [];
                })
              )
          )
        )
        .subscribe({
          error: () => {
            this.isSubmitting = false;

            this.toastr.clear();
            this.toastr.error(
              'Image upload failed',
              'Error',
              {
                positionClass: 'toast-top-right',
                progressBar: true,
                closeButton: true,
                timeOut: 4000
              }
            );
          }
        })
    );
  }

  public onCancel(): void {
    this.goToAnnouncementsPage();
  }

  public goToAnnouncementsPage(): void {
    if (!this.adminId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses',
      this.courseId,
      'announcements'
    ]);
  }

  public goToCoursesPage(): void {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses'
    ]);
  }

  public goToDashboardPage(): void {
    void this.router.navigate([
      '/admin',
      this.adminId,
      'dashboard'
    ]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
