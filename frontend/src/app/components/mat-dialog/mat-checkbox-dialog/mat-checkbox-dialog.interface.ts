import { UUID } from 'angular2-uuid';
import { CheckboxStateEnum } from '../enum/checkbox-state.enum';

export interface MatCheckboxDialogInterface {
	title: string;

	checkboxList: Array<MatCheckboxInterface>;
	checkboxCheckedTitle: string;
	checkboxIntermediateTitle: string;
	textOkButton: string;
	textCancelButton: string;
}

export interface MatCheckboxInterface {
	id: UUID;
	label: string;
	state: CheckboxStateEnum;
}
