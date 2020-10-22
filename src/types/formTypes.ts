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
	label?: string; // User-created
	description?: string;
	multi?: boolean;
	multiStar?: boolean;
	defaultVal: string;
	inputs: InputTypeProps[];
	selectOptions?: string[];
	orderNum?: number;
	onUpdateInputs?: (inputs: InputTypeProps[]) => void;

	// Deprecated
	typeIcon?: string; // Set for deletion in backfill procedures
};

export type InputTypeProps = {
	uniqueId?: string;
	type: inputTypes;
	val: string;
	placeholder?: string;
	readOnly?: boolean;
	selectOptions?: string[];
	onUpdateVal?: (val: any) => void;
};
