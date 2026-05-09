import { Component, Input } from '@angular/core';
import { IonItem, IonLabel, IonList, IonSkeletonText } from '@ionic/angular/standalone';
import { NgForOf } from '@angular/common';

@Component({
	selector: 'ion-skeleton-list',
	templateUrl: './ion-skeleton-list.component.html',
	styleUrls: ['./ion-skeleton-list.component.scss'],
	imports: [
		IonList,
		NgForOf,
		IonItem,
		IonSkeletonText,
		IonLabel
	],
	standalone: true
})
export class IonSkeletonListComponent {
	@Input() skeletonTextCount = 10;
}
