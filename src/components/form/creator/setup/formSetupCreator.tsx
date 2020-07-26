import { Col, Form, FormGroup, InputGroup, Row } from "react-bootstrap";
import React, { useEffect, useRef } from "react";

import { BBCodeFormType } from "types/formTypes";

type FormNameCreatorProps = {
	val: string;
	setVal: (name: string) => void;
	loadBBCodeForm: (bbCodeForm: BBCodeFormType) => void;
};

const FormNameCreator = ({
	val,
	setVal,
	loadBBCodeForm
}: FormNameCreatorProps) => {
	const formNameRef = useRef<HTMLInputElement>(null!);

	useEffect(() => {
		if (formNameRef.current != null) {
			formNameRef.current.focus();
		}
	});

	return (
		<Row>
			<Col xs={12}>
				<h4 className="header">New Form</h4>
				<InputGroup>
					<FormGroup style={{ width: "100%" }}>
						<Form.Control
							type="text"
							size="lg"
							value={val}
							onChange={(e) => {
								setVal(e.target.value);
							}}
							ref={formNameRef}
							placeholder="Name"
						/>
					</FormGroup>
				</InputGroup>
			</Col>
		</Row>
	);
};

export default FormNameCreator;
