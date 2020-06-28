import React, { useRef, useEffect } from "react";
import { Row, Col, InputGroup, Form, FormGroup } from "react-bootstrap";
import Uploader from "../../../Uploader/uploader";
import { FileRejection, DropEvent } from "react-dropzone";
import { BBCodeFormType } from "../../../../context";
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

	const onDrop = <T extends File>(
		acceptedFiles: T[],
		fileRejections: FileRejection[],
		event: DropEvent
	): void => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				const binaryStr = reader.result;
				if (binaryStr != null) {
					const bbCodeFormJson = JSON.parse(binaryStr.toString());
					// Send the form via prop function back to formCreator where it'll be loaded in as the newBBCodeForm and in state
					loadBBCodeForm(bbCodeFormJson);
				}
			};
			reader.readAsText(file);
		});
	};

	useEffect(() => {
		if (formNameRef.current != null) {
			formNameRef.current.focus();
		}
	});

	return (
		<div className="component-wrapper flex-grow-1">
			<Row className="flex-grow-1">
				<Col xs={12} sm={8}>
					<h4>New Form</h4>
					<InputGroup>
						<FormGroup>
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
				<Col xs={12} sm={4}>
					<h4>Upload From File</h4>
					<span className="small text-muted">
						THIS WILL OVERRIDE ANY PROGRESS
					</span>
					<Uploader onDrop={onDrop} />
				</Col>
			</Row>
		</div>
	);
};

export default FormNameCreator;
