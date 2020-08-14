import {
	Col,
	Form,
	FormGroup,
	InputGroup,
	ResponsiveEmbed,
	Row
} from "react-bootstrap";
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
				<h4 className="header">Form Name</h4>
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
						/>
					</FormGroup>
				</InputGroup>
			</Col>
			<Col xs={12}>
				<ResponsiveEmbed aspectRatio="16by9">
					<iframe
						src="https://www.youtube.com/embed/MDZ6BUEVi28"
						frameBorder="0"
						allowFullScreen
						title="video"
					/>
				</ResponsiveEmbed>
			</Col>
		</Row>
	);
};

export default FormNameCreator;
