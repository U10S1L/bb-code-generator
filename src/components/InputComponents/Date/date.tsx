import { Form } from "react-bootstrap";
import { InputTypeProps } from "types/formTypes";
import React from "react";

export const Date = ({
	placeholder,
	readOnly,
	val,
	setVal
}: InputTypeProps) => {
	return (
		<Form.Control
			type="date"
			value={val}
			onChange={(e) => {
				setVal && setVal(e.target.value);
			}}
			placeholder={placeholder}
			readOnly={readOnly}
		/>
	);
};
