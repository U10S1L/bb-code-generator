import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

const ShortText = ({ placeholder, readOnly, val, setVal }: InputTypeProps) => {
	return (
		<Form.Control
			type="text"
			value={val}
			onChange={(e) => {
				setVal && setVal(e.target.value);
			}}
			placeholder={placeholder}
			readOnly={readOnly}
		/>
	);
};

export default ShortText;
