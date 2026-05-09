import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MatMultiActionsInterface {
	title: string;
	action?: Array<actionInterface>;
	imageUrl?: string;
	faIcon?: IconProp;
	dataList?: Array<dataListInterface>;
	message?: string;
}

export interface actionInterface {
	label: string;
	color: string;
	handler: () => void;
}

export interface dataListInterface {
	key: string;
	value: string;
}
