import { Form } from "react-bootstrap";
import { InputTypeProps } from "types/formTypes";
import React from "react";

const ShortText = ({
	uniqueId,
	placeholder,
	readOnly,
	val,
	onUpdateVal
}: InputTypeProps) => {
	return (
		<Form.Control
			id={uniqueId}
			type="text"
			value={val}
			placeholder={placeholder}
			readOnly={readOnly}
			autoComplete="off"
			onChange={(e) => {
				onUpdateVal && onUpdateVal(e.target.value);
			}}
			style={{ paddingRight: "2.5rem" }}
		/>
	);
};

export default ShortText;
