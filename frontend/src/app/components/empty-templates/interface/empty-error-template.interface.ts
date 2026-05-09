import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TemplateMode } from '../enums/template-mode';

export interface EmptyErrorTemplateInterface {
	faIcon?: IconProp;
	mode: TemplateMode;
	title: string;
	description?: string;
}
