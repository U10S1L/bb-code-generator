import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

export const Dropdown = ({
	placeholder,
	readOnly,
	val,
	setVal,
	defaultVal,
	selectOptions
}: InputTypeProps) => {
	useEffect(() => {
		if (setVal !== undefined && defaultVal !== undefined) {
			setVal(defaultVal);
		}
	}, []);

	return (
		<Form.Control
			as="select"
			value={val}
			onChange={(e) => {
				setVal && setVal(e.target.value);
			}}
			placeholder={placeholder}
			readOnly={readOnly}>
			{selectOptions?.map((selectOption, i) => {
				return <option key={i}>{selectOption}</option>;
			})}
		</Form.Control>
	);
};
