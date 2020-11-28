import {
	Accordion,
	Button,
	Col,
	Container,
	Form,
	InputGroup,
	ResponsiveEmbed,
	Row
} from "react-bootstrap";
import React, { useEffect, useRef } from "react";

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
				<InputGroup>
					<Form.Group style={{ width: "100%" }}>
						<Form.Label>Form Name</Form.Label>
						<Form.Control
							type="text"
							value={setupFields.name}
							onChange={(e) => {
								updateSetupFields({ ...setupFields, name: e.target.value });
							}}
							ref={formNameRef}
						/>
					</Form.Group>
				</InputGroup>
			</Col>
			<Col xs={12}>
				<InputGroup>
					<Form.Group style={{ width: "100%" }}>
						<Form.Label>
							<div style={{ display: "flex", alignItems: "center" }}>
								Bookmark Link
								<QuestionMarkTooltip
									id="bookmarkLinkExplanation"
									text={`Adds buttons to open this link on the My Forms page and when Generated BBCode for a form.`}
								/>
							</div>
						</Form.Label>
						<Form.Control
							type="text"
							value={setupFields.bookmarkLink}
							onChange={(e) => {
								updateSetupFields({
									...setupFields,
									bookmarkLink: e.target.value
								});
							}}
						/>
					</Form.Group>
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
						<Accordion.Toggle as={Button} variant="info" eventKey="0">
							Tutorial
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
