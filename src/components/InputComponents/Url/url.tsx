import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

export const Url = ({ readOnly, val, setVal }: InputTypeProps) => {
	const valObj = JSON.parse(val);
	return (
		<div style={{ display: "flex", flex: 1 }}>
			<Form.Control
				type="text"
				value={valObj && valObj.link !== undefined ? valObj.link : ""}
				onChange={(e) => {
					setVal && setVal(JSON.stringify({ ...valObj, link: e.target.value }));
				}}
				placeholder={"Text"}
				readOnly={readOnly}
			/>
			<Form.Control
				type="text"
				value={valObj && valObj.text !== undefined ? valObj.text : ""}
				onChange={(e) => {
					setVal && setVal(JSON.stringify({ ...valObj, text: e.target.value }));
				}}
				placeholder={"Link"}
				readOnly={readOnly}
			/>
		</div>
	);
};
