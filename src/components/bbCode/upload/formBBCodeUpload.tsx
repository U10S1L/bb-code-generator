import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useRef } from "react";

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
		<Row>
			<Col xs={12}>
				<Container className="h-100">
					<Row className="h-100">
						<TextAreaAutosize
							className="form-control"
							value={rawBBCode}
							placeholder="Paste the raw BBCode here."
							onChange={(e) => setRawBBCode(e.target.value)}
							ref={rawBBCodeRef}
							style={{ margin: "1rem 0" }}
							minRows={15}
						/>
					</Row>
				</Container>
			</Col>
		</Row>
	);
};

export default FormBBCodeUpload;
