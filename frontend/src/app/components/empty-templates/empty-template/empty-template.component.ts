import { Component, Input } from '@angular/core';
import { EmptyErrorTemplateInterface } from '../interface/empty-error-template.interface';
import { TemplateMode } from '../enums/template-mode';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
	selector: 'empty-template',
	templateUrl: './empty-template.component.html',
	styleUrls: ['./empty-template.component.scss'],
	imports: [
		NgIf,
		FaIconComponent
	],
	standalone: true
})
export class EmptyTemplateComponent {
	public TemplateMode = TemplateMode;
	@Input() emptyTemplateDetails: EmptyErrorTemplateInterface;
}
