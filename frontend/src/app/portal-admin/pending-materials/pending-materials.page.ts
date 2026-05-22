import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import {
  selectAllPendingMaterials,
  selectMaterialDetails
} from '../../material/+state/material.selector';
import { MaterialActions } from '../../material/+state/material.action';
import { MaterialItemBo } from '../../material/bo/material-item.bo';
import { MaterialService } from '../../material/service/material.service';
import { MaterialStatusEnum } from '../../material/+state/enums/material-status.enum';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    FaIconComponent
  ],
  templateUrl: './pending-materials.page.html',
  styleUrl: './pending-materials.page.scss'
})
export class PendingMaterialsPage implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly materialService = inject(MaterialService);
  private readonly toastr = inject(ToastrService);
  private readonly subscription$ = new Subscription();

  public adminId: string | null = null;
  public courseId: string | null = null;

  public search$ = new BehaviorSubject<string>('');

  public pendingMaterials$ = this.store.pipe(
    select(selectAllPendingMaterials)
  );

  public materialDetailsState$ = this.store.pipe(
    select(selectMaterialDetails)
  );

  public filteredMaterials$ = combineLatest([
    this.pendingMaterials$,
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
    this.toastr.clear();

    this.adminId =
      this.route.parent?.snapshot.paramMap.get('id') ??
      this.route.snapshot.paramMap.get('id');

    this.courseId =
      this.route.snapshot.paramMap.get('courseId') ??
      this.route.parent?.snapshot.paramMap.get('courseId');

    this.reviewMaterialSubscription();
    this.loadPendingMaterials();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public reviewMaterialSubscription(): void {
    this.subscription$.add(
      this.materialDetailsState$.subscribe(materialState => {

        if (materialState?.status === MaterialStatusEnum.reviewSuccess) {
          this.toastr.clear();

          this.toastr.success(
            'Material reviewed successfully',
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

        if (materialState?.status === MaterialStatusEnum.reviewFailure) {
          this.toastr.clear();

          this.toastr.error(
            'Failed to review material',
            'Error',
            {
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true,
              timeOut: 3000
            }
          );

          this.store.dispatch(MaterialActions.resetMaterialState());
        }
      })
    );
  }

  public loadPendingMaterials(): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      MaterialActions.loadPendingMaterialsByCourse({
        courseId: this.courseId
      })
    );
  }

  public approveMaterial(material: MaterialItemBo): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      MaterialActions.reviewMaterial({
        id: material.id,
        courseId: this.courseId,
        material: {
          approvalStatus: 'APPROVED'
        }
      })
    );
  }

  public rejectMaterial(material: MaterialItemBo): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      MaterialActions.reviewMaterial({
        id: material.id,
        courseId: this.courseId,
        material: {
          approvalStatus: 'REJECTED',
          rejectionReason: 'Rejected'
        }
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
    //pdf
    if (
      mimeType.includes('pdf') ||
      filename.endsWith('.pdf')
    ) {
      return 'PDF';
    }

    //word
    if (
      mimeType.includes('word') ||
      mimeType.includes('msword') ||
      filename.endsWith('.doc') ||
      filename.endsWith('.docx')
    ) {
      return 'WORD';
    }

    //excel
    if (
      mimeType.includes('excel') ||
      mimeType.includes('spreadsheet') ||
      filename.endsWith('.xls') ||
      filename.endsWith('.xlsx') ||
      filename.endsWith('.csv')
    ) {
      return 'EXCEL';
    }

    //powerpoint
    if (
      mimeType.includes('presentation') ||
      mimeType.includes('powerpoint') ||
      filename.endsWith('.ppt') ||
      filename.endsWith('.pptx')
    ) {
      return 'POWERPOINT';
    }

    //html
    if (
      mimeType.includes('html') ||
      filename.endsWith('.html') ||
      filename.endsWith('.htm')
    ) {
      return 'HTML';
    }
//image
    if (
      mimeType.startsWith('image/')
    ) {
      return 'IMAGE';
    }

    //video
    if (
      mimeType.startsWith('video/')
    ) {
      return 'VIDEO';
    }

    //audio
    if (
      mimeType.startsWith('audio/')
    ) {
      return 'AUDIO';
    }
    //mp4
    if (
      filename.endsWith('.mp4')
    ) {
      return 'MP4 VIDEO';
    }
    //mp3
    if (
      filename.endsWith('.mp3')
    ) {
      return 'MP3 AUDIO';
    }

    return 'FILE';
  }
  public getUploaderInitials(name?: string): string {
    if (!name) {
      return '?';
    }

    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  public navigateToApprovedMaterials(): void {
    if (!this.adminId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/admin',
      this.adminId,
      this.courseId,
      'materials'
    ]);
  }
}
