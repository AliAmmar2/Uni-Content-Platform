import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface PopoverBoxInterface<T = any> {
	label: string;
	htmlElementId?: string;
	role?: string,
	faIcon?: IconProp;
	visible?: boolean;
	disable?: boolean;
	selectedItemLabel?: string;
	data?: T;
	handler: (...params: any) => void;
}
