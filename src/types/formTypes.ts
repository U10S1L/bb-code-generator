interface Form {
	uid: string;
	name: string;
	fields: Field[];
	bookmarkLink: string;
	createdTimestamp: number;
	updatedTimestamp: number;
	progressTimestamp?: number;
	order?: number;

	// deprecated
	inputComponents?: Field[];
}

export interface BBCodeForm extends Form {
	rawBBCode: string;
	matchedBBCode: string;
}

export interface FormGroup {
	formGroupName: string;
	forms: Form[];
}

export type fieldType =
	| { typeCode: "shortText"; typeName: "Single Line" }
	| { typeCode: "longText"; typeName: "Multi Line" }
	| { typeCode: "dateTime"; typeName: "Date & Time" }
	| { typeCode: "dropdown"; typeName: "Dropdown" }
	| { typeCode: "checkbox"; typeName: "Checkbox" }
	| { typeCode: "date"; typeName: "Date" }
	| { typeCode: "time"; typeName: "Time" }
	| { typeCode: "url"; typeName: "Hyperlink" }
	| { typeCode: "listItem"; typeName: "List Items [*]" };

export interface Field {
	uniqueId: string;
	fieldType: fieldType;
	label?: string;
	description?: string;
	multi?: boolean;
	multiStar?: boolean;
	defaultVal: string;
	inputs: Input[];
	selectOptions?: string[];
	orderNum?: number;
	onUpdateInputs?: (inputs: Input[]) => void;

	// Deprecated
	type?:
		| "shortText"
		| "longText"
		| "dateTime"
		| "dropdown"
		| "checkbox"
		| "date"
		| "time"
		| "url"
		| "listItem";
	typeName?:
		| "Single Line"
		| "Multi Line"
		| "Date & Time"
		| "Dropdown"
		| "Checkbox"
		| "Date"
		| "Time"
		| "Hyperlink"
		| "List Items [*]";
	typeIcon?: string; // Set for deletion in backfill procedures
}

export interface FieldGroup {
	name: string;
	fields: Field[];
}

export interface Input {
	uniqueId?: string;
	val: string;
	placeholder?: string;
	readOnly?: boolean;
	selectOptions?: string[];
	onUpdateVal?: (val: any) => void;

	// Deprecated
	type?: any;
}
