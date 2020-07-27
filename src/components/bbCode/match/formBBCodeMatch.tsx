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
								<Card key={i} style={{ borderRadius: 0 }}>
									<Card.Body>
										<Card.Title>
											{inputComponent.label}
											<span className="text-muted small">
												{inputComponent.multi &&
												inputComponent.type !== "listItem"
													? " (Multi)"
													: null}
												{inputComponent.type === "listItem"
													? " (List Items [*])"
													: null}
											</span>
										</Card.Title>
										{!matched ? (
											<CopyToClipboard
												text={inputComponent.uniqueId}
												onCopy={() =>
													InfoToast(
														`Copied 🆔 for field '${inputComponent.label}' to clipboard. Paste it in the BBCode.`
													)
												}>
												<Button variant="light">
													<span role="img" aria-label="id">
														🆔
													</span>
												</Button>
											</CopyToClipboard>
										) : (
											<div>
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
											</div>
										)}
										<div
											style={{ display: "flex", justifyContent: "flex-end" }}>
											{!matched ? (
												<span style={{ color: "red" }}>Unmatched</span>
											) : (
												<span style={{ color: "green" }}>Matched</span>
											)}
										</div>
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
								text={`Paste each <span role="img" aria-label="id"> 🆔 </span> into the BBCode below where you would normally type the value.`}
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
