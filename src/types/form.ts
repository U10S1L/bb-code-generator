import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type inputTypes =
	| "shortText"
	| "longText"
	| "dateTime"
	| "dropdown"
	| "checkbox"
	| "date"
	| "time"
	| "url";

export type InputComponentProps = {
	uniqueId: string;
	type: inputTypes;
	typeName:
		| "Text Line"
		| "Text Box"
		| "Date & Time"
		| "Dropdown"
		| "Checkbox"
		| "Date"
		| "Time"
		| "Text & Link";
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
