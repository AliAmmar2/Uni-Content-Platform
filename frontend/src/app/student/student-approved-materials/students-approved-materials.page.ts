import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { MaterialItemBo } from '../../material/bo/material-item.bo';
import { MaterialActions } from '../../material/+state/material.action';
import { MaterialService } from '../../material/service/material.service';
import {
  selectAllApprovedMaterials,
  selectMaterialDetails
} from '../../material/+state/material.selector';
import { MaterialStatusEnum } from '../../material/+state/enums/material-status.enum';

import { StudentActions } from '../../student/+state/student.action';
import { selectStudentDetails } from '../../student/+state/student.selector';
import { LOGGED_IN_STUDENT_KEY } from '../../student/+state/student-details.reducer';

import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { MatMultiActionsInterface } from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    FaIconComponent
  ],
  templateUrl: './students-approved-materials.page.html',
  styleUrl: './students-approved-materials.page.scss'
})
export class StudentsApprovedMaterialsPage implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly materialService = inject(MaterialService);
  private readonly toastr = inject(ToastrService);
  private readonly popoverBoxService = inject(PopoverBoxService);
  private readonly ngxMdDialogService = inject(NgxMdDialogService);
  private readonly subscription$ = new Subscription();

  public universityId: string | null = null;
  public courseId: string | null = null;
  public isModerator = false;

  public search$ = new BehaviorSubject<string>('');

  public studentDetailsSelected$ = this.store.pipe(
    select(selectStudentDetails)
  );

  public materialDetailsSelected$ = this.store.pipe(
    select(selectMaterialDetails)
  );

  public approvedMaterials$ = this.store.pipe(
    select(selectAllApprovedMaterials)
  );

  public filteredMaterials$ = combineLatest([
    this.approvedMaterials$,
    this.search$
  ]).pipe(
    map(([materials, search]) => {
      const term = search.toLowerCase().trim();

      if (!term) {
        return materials;
      }

      return materials.filter((material: MaterialItemBo) => {
        return (
          material.title?.toLowerCase().includes(term) ||
          material.description?.toLowerCase().includes(term) ||
          material.uploadedByName?.toLowerCase().includes(term) ||
          material.courseCode?.toLowerCase().includes(term) ||
          material.courseName?.toLowerCase().includes(term)
        );
      });
    })
  );

  ngOnInit(): void {
    this.universityId =
      this.route.parent?.snapshot.paramMap.get('universityId') ??
      this.route.snapshot.paramMap.get('universityId');

    this.courseId =
      this.route.snapshot.paramMap.get('courseId') ??
      this.route.parent?.snapshot.paramMap.get('courseId');

    this.store.dispatch(StudentActions.loadMe());

    this.studentDetailsSubscription();
    this.materialDetailsSubscription();
    this.loadApprovedMaterials();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private studentDetailsSubscription(): void {
    this.subscription$.add(
      this.studentDetailsSelected$.subscribe(studentState => {
        const loggedInStudent = studentState?.[LOGGED_IN_STUDENT_KEY];

        this.isModerator = loggedInStudent?.role === 'MODERATOR';
      })
    );
  }

  private materialDetailsSubscription(): void {
    this.subscription$.add(
      this.materialDetailsSelected$.subscribe(materialDetailsState => {
        if (!materialDetailsState) {
          return;
        }

        if (materialDetailsState.status === MaterialStatusEnum.deleteSuccess) {
          this.toastr.clear();

          this.toastr.success(
            'Material deleted successfully',
            'Success',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );

          this.store.dispatch(MaterialActions.resetMaterialState());
        }

        if (materialDetailsState.status === MaterialStatusEnum.deleteFailure) {
          this.toastr.clear();

          this.toastr.error(
            materialDetailsState.error?.message || 'Something went wrong',
            'Error',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 4000
            }
          );

          this.store.dispatch(MaterialActions.resetMaterialState());
        }
      })
    );
  }

  public loadApprovedMaterials(): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      MaterialActions.loadApprovedMaterialsByCourse({
        courseId: this.courseId
      })
    );
  }

  public openMaterial(material: MaterialItemBo): void {
    this.materialService
      .getMaterialAccessUrl(material.id, 'view')
      .subscribe({
        next: response => {
          window.open(response.url, '_blank', 'noopener,noreferrer');
        }
      });
  }

  public downloadMaterial(material: MaterialItemBo): void {
    this.toastr.clear();

    const loadingToast = this.toastr.info(
      'Preparing download...',
      'Download in Progress',
      {
        disableTimeOut: true,
        closeButton: false,
        progressBar: true,
        positionClass: 'toast-top-right'
      }
    );

    this.materialService
      .getMaterialAccessUrl(material.id, 'download')
      .subscribe({
        next: response => {
          window.location.href = response.url;

          this.toastr.remove(loadingToast.toastId);

          this.toastr.success(
            'Download started successfully',
            'Success',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );
        },
        error: () => {
          this.toastr.remove(loadingToast.toastId);

          this.toastr.error(
            'Failed to start download',
            'Error',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );
        }
      });
  }

  public getFileType(material: MaterialItemBo): string {
    const mimeType = material.mimeType?.toLowerCase() ?? '';
    const filename = material.originalFilename?.toLowerCase() ?? '';

    if (mimeType.includes('pdf') || filename.endsWith('.pdf')) {
      return 'PDF';
    }

    if (
      mimeType.includes('word') ||
      mimeType.includes('msword') ||
      filename.endsWith('.doc') ||
      filename.endsWith('.docx')
    ) {
      return 'WORD';
    }

    if (
      mimeType.includes('excel') ||
      mimeType.includes('spreadsheet') ||
      filename.endsWith('.xls') ||
      filename.endsWith('.xlsx') ||
      filename.endsWith('.csv')
    ) {
      return 'EXCEL';
    }

    if (
      mimeType.includes('presentation') ||
      mimeType.includes('powerpoint') ||
      filename.endsWith('.ppt') ||
      filename.endsWith('.pptx')
    ) {
      return 'POWERPOINT';
    }

    if (
      mimeType.includes('html') ||
      filename.endsWith('.html') ||
      filename.endsWith('.htm')
    ) {
      return 'HTML';
    }

    if (mimeType.startsWith('image/')) {
      return 'IMAGE';
    }

    if (mimeType.startsWith('video/')) {
      return 'VIDEO';
    }

    if (mimeType.startsWith('audio/')) {
      return 'AUDIO';
    }

    return 'FILE';
  }

  public navigateBackToCourses(): void {
    if (!this.universityId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses'
    ]);
  }

  public navigateToUploadMaterial(): void {
    if (!this.universityId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses',
      this.courseId,
      'upload-material'
    ]);
  }

  public navigateToPendingMaterials(): void {
    if (!this.universityId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/students',
      this.universityId,
      'courses',
      this.courseId,
      'pending-materials'
    ]);
  }

  public presentPopoverActions(
    event: MouseEvent,
    material: MaterialItemBo
  ): void {
    if (!this.isModerator) {
      return;
    }

    this.popoverBoxService.openPanel(event, [
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(material);
        }
      }
    ]);
  }

  public presentDeleteAlert(material: MaterialItemBo): void {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Material?',
      message: material.title + ' will be permanently deleted!',
      action: [
        {
          label: 'Yes',
          color: '#d40000',
          handler: () => {
            this.deleteMaterial(material.id);
          }
        },
        {
          label: 'Cancel',
          color: '#88a5db',
          handler: () => {}
        }
      ]
    };

    this.ngxMdDialogService.openMultiActionsDialog(
      matYesNoDialogData,
      { width: '400px' }
    );
  }

  public deleteMaterial(materialId: string): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      MaterialActions.deleteMaterial({
        id: materialId,
        courseId: this.courseId
      })
    );
  }
}
