type inputTypes =
	| "shortText"
	| "longText"
	| "number"
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
		| "Short Text"
		| "Long Text"
		| "Number"
		| "Date & Time"
		| "Dropdown"
		| "Checkbox"
		| "Date"
		| "Time"
		| "Url";
	label?: string; // User-created
	description?: string;
	multi?: boolean;
	defaultVal: string;
	inputs: InputTypeProps[];
	onUpdateInputs?: (inputs: InputTypeProps[]) => void;
	selectOptions?: string[];
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
