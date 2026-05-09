import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface MatAlertWithButtonsInterface {
	title: string;
	message: string;
	faIcon?: IconProp;
	confirmButton: actionInterface;
	dismissButton: actionInterface;
}

interface actionInterface {
	label: string;
	color: string;
	handler: () => void;
	disabled?: boolean;
}
