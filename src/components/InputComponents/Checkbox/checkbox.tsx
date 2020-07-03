import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

export const Checkbox = ({
	placeholder,
	readOnly,
	val,
	setVal
}: InputTypeProps) => {
	return (
		<Form.Check
			checked={val}
			onChange={() => {
				setVal && setVal(!val);
			}}
			placeholder={placeholder}
			readOnly={readOnly}></Form.Check>
	);
};
