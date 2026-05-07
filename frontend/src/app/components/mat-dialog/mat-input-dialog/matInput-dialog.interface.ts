import { InputTypeEnum } from './input-type.enum';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MatInputDialogInterface {
	title: string;
	faIcon: IconProp;
	inputList: Array<MatInputInterface>;
	textOkButton: string;
	textCancelButton: string;
	message?: string;
	messageHtml?: string;
	saveOnEnterKey?: boolean;
}

export interface MatInputInterface {
	name: string;
	placeholder?: string;
	role?: string;
	matHint?: string;
	inputType?: InputTypeEnum;
	entryValue?: string;
	valueRegex?: RegExp;
	errorMessage?: string;
}
