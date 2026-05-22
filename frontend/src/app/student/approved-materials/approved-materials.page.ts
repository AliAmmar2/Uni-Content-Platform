import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';
import { selectAllMaterials } from '../../material/+state/material.selector';
import { MaterialItemBo } from '../../material/bo/material-item.bo';
import { MaterialActions } from '../../material/+state/material.action';
import { MATERIAL_KEY } from '../../material/+state/material.reducer';

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
  private readonly subscription$ = new Subscription();

  private activatedRoute = inject(ActivatedRoute);
  public courseId: string | null = null;
  public adminId: string;
  public activeTab: 'APPROVED' | 'PENDING' = 'APPROVED';
  public viewMode: 'grid' | 'list' = 'grid';
  private readonly router = inject(Router);
  public search$ = new BehaviorSubject<string>('');

  public materialsState$ = this.store.pipe(select(selectAllMaterials));

  public filteredMaterials$ = combineLatest([
    this.materialsState$,
    this.search$
  ]).pipe(
    map(([state, search]) => {
      const materials = state?.[MATERIAL_KEY] ?? [];
      const term = search.toLowerCase().trim();

      if (!term) {
        return materials;
      }

      return materials.filter((material: MaterialItemBo) => {
        return (
          material.title?.toLowerCase().includes(term) ||
          material.description?.toLowerCase().includes(term) ||
          material.uploadedByName?.toLowerCase().includes(term) ||
          material.courseCode?.toLowerCase().includes(term)
        );
      });
    })
  );

  protected readonly MATERIAL_KEY = MATERIAL_KEY;

  ngOnInit(): void {
    this.adminId = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    this.courseId =
      this.route.snapshot.paramMap.get('courseId') ??
      this.route.parent?.snapshot.paramMap.get('courseId');

    // if (this.courseId) {
    this.loadApprovedMaterials();
    // }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public setTab(tab: 'APPROVED' | 'PENDING'): void {
    this.activeTab = tab;

    if (tab === 'APPROVED') {
      this.loadApprovedMaterials();
    } else {
      this.loadPendingMaterials();
    }
  }

  public setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  public loadApprovedMaterials(): void {
    if (!this.courseId) {
      return;
    }
    console.log(this.courseId);

    this.store.dispatch(
      MaterialActions.loadApprovedMaterialsByCourse({
        courseId: this.courseId
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

  public openMaterial(material: MaterialItemBo): void {
    window.open(material.fileUrl, '_blank', 'noopener,noreferrer');
  }

  public downloadMaterial(material: MaterialItemBo): void {
    fetch(material.fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = blobUrl;
        link.download = this.getDownloadFileName(material);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      });
  }

  private getDownloadFileName(material: MaterialItemBo): string {
    const fileType = this.getFileType(material).toLowerCase();

    const extension =
      material.fileUrl.split('.').pop()?.split('?')[0] || fileType;

    return `${material.title}.${extension}`;
  }

  public approveMaterial(material: MaterialItemBo): void {
    if (!this.courseId) {
      return;
    }

    this.store.dispatch(
      MaterialActions.reviewMaterial({
        id: material.id,
        material: {
          approvalStatus: 'APPROVED'
        }
      })
    );
  }

  public rejectMaterial(material: MaterialItemBo): void {

    this.store.dispatch(
      MaterialActions.reviewMaterial({
        id: material.id,
        material: {
          approvalStatus: 'REJECTED',
          rejectionReason: 'Rejected by moderator'
        }
      })
    );
  }

  public deleteMaterial(material: MaterialItemBo): void {
    this.store.dispatch(
      MaterialActions.deleteMaterial({
        id: material.id
      })
    );
  }

  public getFileType(material: MaterialItemBo): string {

    const url = material.fileUrl?.toLowerCase() ?? '';

    // PDF
    if (url.endsWith('.pdf')) {
      return 'PDF';
    }

    // VIDEO
    if (
      url.endsWith('.mp4') ||
      url.endsWith('.mov') ||
      url.endsWith('.avi') ||
      url.endsWith('.mkv') ||
      url.endsWith('.webm')
    ) {
      return 'VIDEO';
    }

    // IMAGE
    if (
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.png') ||
      url.endsWith('.gif') ||
      url.endsWith('.svg') ||
      url.endsWith('.webp')
    ) {
      return 'IMAGE';
    }

    // AUDIO
    if (
      url.endsWith('.mp3') ||
      url.endsWith('.wav') ||
      url.endsWith('.ogg') ||
      url.endsWith('.aac')
    ) {
      return 'AUDIO';
    }

    // EXCEL
    if (
      url.endsWith('.xlsx') ||
      url.endsWith('.xls') ||
      url.endsWith('.csv')
    ) {
      return 'XLSX';
    }

    // WORD
    if (
      url.endsWith('.doc') ||
      url.endsWith('.docx')
    ) {
      return 'WORD';
    }

    // POWERPOINT
    if (
      url.endsWith('.ppt') ||
      url.endsWith('.pptx')
    ) {
      return 'POWERPOINT';
    }

    // XML
    if (url.endsWith('.xml')) {
      return 'XML';
    }

    // TEXT
    if (
      url.endsWith('.txt') ||
      url.endsWith('.md') ||
      url.endsWith('.json')
    ) {
      return 'TEXT';
    }

    // ARCHIVES
    if (
      url.endsWith('.zip') ||
      url.endsWith('.rar') ||
      url.endsWith('.7z')
    ) {
      return 'ARCHIVE';
    }

    return 'FILE';
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
}
