import React, { useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TextAreaAutosize from "react-textarea-autosize";

type FormBBCodeUploadProps = {
	rawBBCode: string;
	setRawBBCode: (bbCode: string) => void;
};

const FormBBCodeUpload = ({
	rawBBCode,
	setRawBBCode
}: FormBBCodeUploadProps) => {
	const rawBBCodeRef = useRef<HTMLTextAreaElement>(null!);

	useEffect(() => {
		if (rawBBCodeRef.current != null) {
			rawBBCodeRef.current.focus();
		}
	});
	return (
		<div className="component-wrapper flex-grow-1">
			<Row className="flex-grow-1">
				<Col xs={12}>
					<Container className="h-100">
						<Row className="h-100">
							<TextAreaAutosize
								className="form-control"
								value={rawBBCode}
								onChange={(e) => setRawBBCode(e.target.value)}
								ref={rawBBCodeRef}
								style={{ margin: "1rem 0" }}
							/>
						</Row>
					</Container>
				</Col>
			</Row>
		</div>
	);
};

export default FormBBCodeUpload;
