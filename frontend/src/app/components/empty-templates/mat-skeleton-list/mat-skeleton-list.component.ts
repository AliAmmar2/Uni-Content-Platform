import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
	selector: 'mat-skeleton-list',
	templateUrl: './mat-skeleton-list.component.html',
	styleUrls: ['./mat-skeleton-list.component.scss'],
	imports: [
		NgForOf,
		NgxSkeletonLoaderModule
	],
	standalone: true
})
export class MatSkeletonListComponent {
	@Input() skeletonTextCount = 10;
}
