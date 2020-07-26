import { Form } from "react-bootstrap";
import { InputTypeProps } from "types/formTypes";
import React from "react";

export const Time = ({
	placeholder,
	readOnly,
	val,
	setVal
}: InputTypeProps) => {
	return (
		<Form.Control
			type="time"
			value={val}
			onChange={(e) => {
				setVal && setVal(e.target.value);
			}}
			placeholder={placeholder}
			readOnly={readOnly}
		/>
	);
};
