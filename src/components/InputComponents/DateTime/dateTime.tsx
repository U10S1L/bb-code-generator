import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

export const DateTime = ({
	placeholder,
	readOnly,
	val,
	setVal
}: InputTypeProps) => {
	console.log(val);
	return (
		<Form.Control
			type="datetime-local"
			value={val}
			onChange={(e) => {
				setVal && setVal(e.target.value);
			}}
			placeholder={placeholder}
			readOnly={readOnly}
		/>
	);
};
