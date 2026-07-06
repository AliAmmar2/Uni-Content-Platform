import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';

import { MaterialItemBo } from '../../material/bo/material-item.bo';
import { MaterialActions } from '../../material/+state/material.action';
import { MaterialService } from '../../material/service/material.service';
import { selectAllApprovedMaterials, selectMaterialDetails } from '../../material/+state/material.selector';
import { ToastrService } from 'ngx-toastr';
import { PopoverBoxService } from '../../components/mat-pop-over-box/src';
import {
  MatMultiActionsInterface
} from '../../components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { NgxMdDialogService } from '../../components/mat-dialog/service/ngx-md-dialog.service';
import { MaterialStatusEnum } from '../../material/+state/enums/material-status.enum';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    FaIconComponent
  ],
  templateUrl: './approved-materials.page.html',
  styleUrl: './approved-materials.page.scss'
})
export class ApprovedMaterialsPage implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly materialService = inject(MaterialService);
  private readonly subscription$ = new Subscription();

  public courseId: string | null = null;
  public adminId: string | null = null;

  public search$ = new BehaviorSubject<string>('');
  public materialDetailsSelected$ = this.store.pipe(
    select(selectMaterialDetails)
  );
  public approvedMaterials$ = this.store.pipe(
    select(selectAllApprovedMaterials)
  );

  private readonly toastr = inject(ToastrService);
  protected popoverBoxService = inject(PopoverBoxService);

  private ngxMdDialogService = inject(NgxMdDialogService);

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
    this.adminId =
      this.route.parent?.snapshot.paramMap.get('id') ??
      this.route.snapshot.paramMap.get('id');

    this.courseId =
      this.route.snapshot.paramMap.get('courseId') ??
      this.route.parent?.snapshot.paramMap.get('courseId');
    this.materialDetailsSubscription()
    this.loadApprovedMaterials();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  materialDetailsSubscription(): void {
    this.subscription$.add(
      this.materialDetailsSelected$.subscribe((materialDetailsState) => {
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

          return;
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

  public isViewable(material: MaterialItemBo): boolean {
  const viewableTypes = ['PDF', 'IMAGE', 'VIDEO', 'AUDIO', 'MP4 VIDEO', 'MP3 AUDIO'];
  return viewableTypes.includes(this.getFileType(material));
}

  public openMaterial(material: MaterialItemBo): void {
  if (!this.isViewable(material)) {
    return;
  }

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

  public navigateBackToCourses(): void {
    if (!this.adminId) {
      return;
    }

    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses'
    ]);
  }

  public navigateToUploadMaterial(): void {
    if (!this.adminId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses',
      this.courseId,
      'upload-material'
    ]);
  }

  public navigateToPendingMaterials(): void {
    if (!this.adminId || !this.courseId) {
      return;
    }

    void this.router.navigate([
      '/admin',
      this.adminId,
      'courses',
      this.courseId,
      'pending-materials'
    ]);
  }

  public async presentPopoverActions($event: MouseEvent, material: MaterialItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(material)
        }
      }
    ]);
  }

  public presentDeleteAlert(material: any): void {
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

  public deleteMaterial(materialId: string): void {
    this.store.dispatch(MaterialActions.deleteMaterial({
      id: materialId,
      courseId: this.courseId
    }));
  }
}
