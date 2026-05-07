export interface MatRadioButtonGroupDialogInterface {
	title: string;
	textOkButton: string;
	textCancelButton?: string;
	defaultValue?: MatRadioButtonInterface;
	list: Array<MatRadioButtonInterface>;
}

export interface MatRadioButtonInterface {
	role: any;
	label?: string;
}
