import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

export const Url = ({ placeholder, readOnly, val, setVal }: InputTypeProps) => {
	return (
		<>
			<Form.Group>
				<Form.Label>Link</Form.Label>
				<Form.Control
					type="text"
					value={val.link !== undefined ? val.link : ""}
					onChange={(e) => {
						setVal && setVal({ ...val, link: e.target.value });
					}}
					placeholder={placeholder}
					readOnly={readOnly}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Text</Form.Label>
				<Form.Control
					type="text"
					value={val.text && val.text}
					onChange={(e) => {
						setVal && setVal({ ...val, text: e.target.value });
					}}
					placeholder={placeholder}
					readOnly={readOnly}
				/>
			</Form.Group>
		</>
	);
};
