import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MatAlertDialogInterface {
	iconObj: {
		fontSize: string,
		icon: IconProp,
		color: string
	};
	title: string;
	subTitle?: string;
	message: string;
}
