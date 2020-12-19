import { Form, InputGroup } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "types/formTypes";
import React from "react";

export const Url = ({ readOnly, val, onUpdateVal }: Input) => {
	const valObj = JSON.parse(val);
	return (
		<div style={{ display: "flex", flex: 1 }}>
			<InputGroup>
				<InputGroup.Prepend>
					<InputGroup.Text>
						<FontAwesomeIcon icon={"font"} />
					</InputGroup.Text>
				</InputGroup.Prepend>
				<Form.Control
					type="text"
					value={valObj && valObj.text !== undefined ? valObj.text : ""}
					onChange={(e) => {
						onUpdateVal &&
							onUpdateVal(JSON.stringify({ ...valObj, text: e.target.value }));
					}}
					placeholder={"Text"}
					readOnly={readOnly}
					style={{ paddingRight: "2.5rem" }}
				/>
			</InputGroup>
			<InputGroup>
				<InputGroup.Prepend>
					<InputGroup.Text>
						<FontAwesomeIcon icon="link" />
					</InputGroup.Text>
				</InputGroup.Prepend>
				<Form.Control
					type="text"
					value={valObj && valObj.link !== undefined ? valObj.link : ""}
					onChange={(e) => {
						onUpdateVal &&
							onUpdateVal(JSON.stringify({ ...valObj, link: e.target.value }));
					}}
					placeholder={"Link"}
					readOnly={readOnly}
					style={{ paddingRight: "2.5rem" }}
				/>
			</InputGroup>
		</div>
	);
};
