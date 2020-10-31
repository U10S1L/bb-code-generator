import { Form } from "react-bootstrap";
import { InputTypeProps } from "types/formTypes";
import React from "react";

export const Dropdown = ({
	placeholder,
	readOnly,
	val,
	selectOptions,
	onUpdateVal
}: InputTypeProps) => {
	return (
		<Form.Control
			as="select"
			value={val}
			onChange={(e) => {
				onUpdateVal && onUpdateVal(e.target.value);
			}}
			placeholder={placeholder}
			readOnly={readOnly}>
			{selectOptions?.map((selectOption, i) => {
				return (
					(selectOption !== " " || (selectOption === " " && val === " ")) && (
						<option
							value={selectOption}
							key={i}
							disabled={selectOption === " " && val !== " "}>
							{selectOption}
						</option>
					)
				);
			})}
		</Form.Control>
	);
};
