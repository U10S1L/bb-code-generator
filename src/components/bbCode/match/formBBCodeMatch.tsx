import { Button, Card, Col, Row } from "react-bootstrap";
import React, { useRef } from "react";

import CopyToClipboard from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfoToast } from "components/toast/toast";
import { InputComponentProps } from "types/formTypes";
import { QuestionMarkTooltip } from "components/help/tooltip/tooltips";
import TextAreaAutosize from "react-textarea-autosize";

type FormBBCodeMatchProps = {
	selectedInputComponents: InputComponentProps[];
	matchedBBCode: string;
	setMatchedBBCode: (bbCode: string) => void;
};
type CopyToClipboardButtonProps = {
	inputComponent: InputComponentProps;
};

const getInputComponentDescription = (inputComponent: InputComponentProps) => {
	const { type } = inputComponent;
	if (type === "checkbox") {
		return `Renders as a [cb] or [cbc].`;
	} else if (type === "listItem") {
		return `Paste like [list]🆔[/list].`;
	} else if (type === "url") {
		return `Replace [url][/url] with 🆔.`;
	} else {
		return ``;
	}
};

const CopyToClipboardButton = ({
	inputComponent
}: CopyToClipboardButtonProps) => {
	return (
		<CopyToClipboard
			text={inputComponent.uniqueId}
			onCopy={() => {
				if (inputComponent.type === "listItem") {
					InfoToast(
						`'${
							inputComponent.label
						}' 🆔 copied. ${getInputComponentDescription(inputComponent)}`
					);
				} else if (inputComponent.type === "checkbox") {
					InfoToast(
						`'${
							inputComponent.label
						}' 🆔 copied. ${getInputComponentDescription(inputComponent)}`
					);
				} else if (inputComponent.type === "url") {
					InfoToast(
						`'${
							inputComponent.label
						}' 🆔 copied. ${getInputComponentDescription(inputComponent)}`
					);
				} else {
					InfoToast(`'${inputComponent.label}' 🆔 copied. `);
				}
			}}>
			<Button variant="light" style={{ paddingLeft: 0 }}>
				<span role="img" aria-label="id">
					🆔
				</span>
			</Button>
		</CopyToClipboard>
	);
};

const FormBBCodeMatch = ({
	selectedInputComponents,
	matchedBBCode,
	setMatchedBBCode
}: FormBBCodeMatchProps) => {
	const matchedBBCodeRef = useRef<HTMLTextAreaElement>(null!);
	const inputComponentIsMatched = (uniqueId: string) => {
		return matchedBBCode.includes(uniqueId);
	};

	const goToUniqueIDInMatchedBBCode = (uniqueId: string) => {
		if (matchedBBCodeRef.current != null) {
			let startIndex = matchedBBCodeRef.current.value.indexOf(uniqueId);
			matchedBBCodeRef.current.focus();
			matchedBBCodeRef.current.setSelectionRange(
				startIndex,
				startIndex + uniqueId.length,
				"forward"
			);
		}
	};

	const deleteUniqueIDInMatchedBBCode = (uniqueId: string) => {
		if (matchedBBCodeRef.current != null) {
			goToUniqueIDInMatchedBBCode(uniqueId);
			matchedBBCodeRef.current.setRangeText("");
			matchedBBCodeRef.current.focus();
			setMatchedBBCode(matchedBBCodeRef.current.value);
		}
	};

	return (
		<Row>
			<Col xs={12}>
				<Row>
					<Col xs={4}>
						<h5 className="header">Input Fields</h5>
						{selectedInputComponents.map((inputComponent, i) => {
							const matched = inputComponentIsMatched(inputComponent.uniqueId);
							return (
								<Card key={i} style={{ borderRadius: 0, margin: ".25rem 0" }}>
									<Card.Body>
										<Card.Title style={{ marginBottom: ".35rem" }}>
											{inputComponent.label}
										</Card.Title>
										<Card.Subtitle style={{ marginBottom: ".75rem" }}>
											<span className="small" style={{ opacity: ".65" }}>
												{getInputComponentDescription(inputComponent)}
											</span>
										</Card.Subtitle>
										{!matched ? (
											<div style={{ display: "flex", alignItems: "center" }}>
												<CopyToClipboardButton
													inputComponent={inputComponent}
												/>
												<span style={{ color: "red", marginLeft: "auto" }}>
													Unmatched
												</span>
											</div>
										) : (
											<div style={{ display: "flex", alignItems: "center" }}>
												<CopyToClipboardButton
													inputComponent={inputComponent}
												/>
												<Button
													variant="light"
													onClick={() =>
														goToUniqueIDInMatchedBBCode(inputComponent.uniqueId)
													}>
													<FontAwesomeIcon icon="search" />
												</Button>
												<Button
													variant="light"
													onClick={() =>
														deleteUniqueIDInMatchedBBCode(
															inputComponent.uniqueId
														)
													}>
													<FontAwesomeIcon icon="times"></FontAwesomeIcon>
												</Button>
												<span style={{ color: "green", marginLeft: "auto" }}>
													Matched
												</span>
											</div>
										)}
									</Card.Body>
								</Card>
							);
						})}
					</Col>
					<Col xs={8}>
						<h5 className="header">
							BBCode
							<QuestionMarkTooltip
								id="bbCodeMatchIDs"
								text={`Paste each <span role="img" aria-label="id"> 🆔 </span> into the BBCode where you would normally type the value.`}
							/>
						</h5>

						<TextAreaAutosize
							ref={matchedBBCodeRef}
							className="form-control"
							value={matchedBBCode}
							onChange={(e) => setMatchedBBCode(e.target.value)}
							minRows={15}
						/>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default FormBBCodeMatch;
