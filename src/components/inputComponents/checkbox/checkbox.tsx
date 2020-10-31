import { Form } from "react-bootstrap";
import { InputTypeProps } from "types/formTypes";
import React from "react";

export const Checkbox = ({
	placeholder,
	readOnly,
	val,
	onUpdateVal
}: InputTypeProps) => {
	const boolValue = val === "true" ? true : false;
	return (
		<Form.Check
			checked={val === "true"}
			onChange={() => {
				onUpdateVal && onUpdateVal(boolValue === true ? "false" : "true");
			}}
			placeholder={placeholder}
			readOnly={readOnly}></Form.Check>
	);
};
