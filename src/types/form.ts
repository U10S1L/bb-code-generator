import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

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

export type InputComponentProps = {
	uniqueId: string;
	type: inputTypes;
	typeName:
		| "Single Line"
		| "Multi Line"
		| "Date & Time"
		| "Dropdown"
		| "Checkbox"
		| "Date"
		| "Time"
		| "Hyperlink"
		| "List Items [*]";
	typeIcon: IconDefinition;
	label?: string; // User-created
	description?: string;
	multi?: boolean;
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
