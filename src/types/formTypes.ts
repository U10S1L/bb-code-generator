import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type BBCodeFormType = {
	uid: string;
	name: string;
	inputComponents: InputComponentProps[];
	rawBBCode: string;
	matchedBBCode: string;
	bookmarkLink: string;
	order?: number;
	createdTimestamp: number;
	updatedTimestamp: number;
	progressTimestamp?: number;
};

type inputTypes =
	| "shortText"
	| "longText"
	| "dateTime"
	| "dropdown"
	| "checkbox"
	| "date"
	| "time"
	| "url"
	| "listItem";

type inputTypeNames =
	| "Single Line"
	| "Multi Line"
	| "Date & Time"
	| "Dropdown"
	| "Checkbox"
	| "Date"
	| "Time"
	| "Hyperlink"
	| "List Items [*]";

export type InputComponentProps = {
	uniqueId: string;
	type: inputTypes;
	typeName: inputTypeNames;
	typeIcon: IconDefinition;
	label?: string; // User-created
	description?: string;
	multi?: boolean;
	multiStar?: boolean;
	defaultVal: string;
	inputs: InputTypeProps[];
	onUpdateInputs?: (inputs: InputTypeProps[]) => void;
	selectOptions?: string[];
	orderNum?: number;
};

export type InputTypeProps = {
	type: inputTypes;
	val: string;
	setVal?: (val: any) => void;
	uniqueId?: string;
	placeholder?: string;
	readOnly?: boolean;
	selectOptions?: string[];
};
