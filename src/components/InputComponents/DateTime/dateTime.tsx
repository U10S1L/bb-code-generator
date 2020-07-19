import { Form } from "react-bootstrap";
import { InputTypeProps } from "types/form";
import React from "react";

export const DateTime = ({
	placeholder,
	readOnly,
	val,
	setVal
}: InputTypeProps) => {
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
