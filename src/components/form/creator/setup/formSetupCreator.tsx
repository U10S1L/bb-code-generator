import {
	Accordion,
	Button,
	Col,
	Form,
	FormGroup,
	InputGroup,
	ResponsiveEmbed,
	Row
} from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

import { QuestionMarkTooltip } from "components/help/tooltip/tooltips";

type FormSetupCreatorProps = {
	setupFields: { name: string; bookmarkLink: string };
	updateSetupFields: (setupFields: {
		name: string;
		bookmarkLink: string;
	}) => void;
	showVideoPreview: boolean;
};

const FormSetupCreator = ({
	setupFields,
	updateSetupFields,
	showVideoPreview
}: FormSetupCreatorProps) => {
	const formNameRef = useRef<HTMLInputElement>(null!);

	useEffect(() => {
		if (formNameRef.current != null) {
			formNameRef.current.focus();
		}
	}, []);

	return (
		<Row>
			<Col xs={12}>
				<h4 className="header">Form Name</h4>
				<InputGroup>
					<FormGroup style={{ width: "100%" }}>
						<Form.Control
							type="text"
							size="lg"
							value={setupFields.name}
							onChange={(e) => {
								updateSetupFields({ ...setupFields, name: e.target.value });
							}}
							ref={formNameRef}
						/>
					</FormGroup>
				</InputGroup>
			</Col>
			<Col xs={12}>
				<h5 className="header">
					Bookmark Link
					<QuestionMarkTooltip
						id="bookmarkLinkExplanation"
						text={`Creates a button on `}
					/>
				</h5>
				<InputGroup>
					<FormGroup style={{ width: "100%" }}>
						<Form.Control
							type="text"
							size="lg"
							value={setupFields.bookmarkLink}
							onChange={(e) => {
								updateSetupFields({
									...setupFields,
									bookmarkLink: e.target.value
								});
							}}
						/>
					</FormGroup>
				</InputGroup>
			</Col>

			<Col xs={12}>
				{showVideoPreview && (
					<ResponsiveEmbed aspectRatio="16by9">
						<iframe
							src="https://www.youtube.com/embed/MDZ6BUEVi28"
							frameBorder="0"
							allowFullScreen
							title="video"
						/>
					</ResponsiveEmbed>
				)}
				{!showVideoPreview && (
					<Accordion>
						<Accordion.Toggle as={Button} variant="secondary" eventKey="0">
							Tutorial / Overview Video
						</Accordion.Toggle>
						<Accordion.Collapse eventKey="0">
							<ResponsiveEmbed aspectRatio="16by9">
								<iframe
									src="https://www.youtube.com/embed/MDZ6BUEVi28"
									frameBorder="0"
									allowFullScreen
									title="video"
								/>
							</ResponsiveEmbed>
						</Accordion.Collapse>
					</Accordion>
				)}
			</Col>
		</Row>
	);
};

export default FormSetupCreator;
