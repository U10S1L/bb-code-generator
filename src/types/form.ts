export type InputComponentProps = {
	uniqueId: string;
	type: "shortText" | "longText" | "number" | "dateTime" | "dropdown";
	typeName: "Short Text" | "Long Text" | "Number" | "Date Time" | "Dropdown";
	label?: string; // User-created
	description?: string;
	defaultVal?: string;
	multi?: boolean;
	inputs: InputTypeProps[];
	onUpdateInputs?: (inputs: InputTypeProps[]) => void;
	selectOptions?: string[];
};

export type InputTypeProps = {
	type: "shortText" | "longText" | "number" | "dateTime" | "dropdown";
	uniqueId?: string;
	placeholder?: string;
	readOnly?: boolean;
	val: string;
	setVal?: (val: string) => void;
	defaultVal?: string;
	selectOptions?: string[];
};
