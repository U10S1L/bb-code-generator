import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

export const Checkbox = ({
	placeholder,
	readOnly,
	val,
	setVal
}: InputTypeProps) => {
	const boolValue = val === "true" ? true : false;
	return (
		<Form.Check
			checked={val == "true"}
			onChange={() => {
				setVal && setVal(boolValue == true ? "false" : "true");
			}}
			placeholder={placeholder}
			readOnly={readOnly}></Form.Check>
	);
};
