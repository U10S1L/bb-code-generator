import React, { useRef } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputComponentProps } from "../../../../../types/form";
import { SuccessToast } from "../../../../Toast/toast";
import CopyToClipboard from "react-copy-to-clipboard";
import TextAreaAutosize from "react-textarea-autosize";
import { QuestionMarkTooltip } from "../../../../Help/Tooltip/tooltips";
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
				<Container>
					<Row>
						<Col xs={4}>
							<h5 className="header">Unmatched Fields</h5>
							{selectedInputComponents.map((inputComponent, i) => {
								return (
									!inputComponentIsMatched(inputComponent.uniqueId) && (
										<Card key={i}>
											<Card.Body>
												<Card.Title>
													{inputComponent.label}
													<span className="text-muted small">
														{inputComponent.multi ? " (Multi)" : null}
													</span>
												</Card.Title>
												<Card.Text>
													<CopyToClipboard
														text={inputComponent.uniqueId}
														onCopy={() =>
															SuccessToast(
																`Copied 🆔 for field '${inputComponent.label}' to clipboard. Paste it in the BBCode.`
															)
														}>
														<Button variant="light">
															<span role="img" aria-label="id">
																🆔
															</span>
														</Button>
													</CopyToClipboard>
												</Card.Text>
											</Card.Body>
										</Card>
									)
								);
							})}
							<hr />
							<h5 className="header">Matched Fields</h5>
							{selectedInputComponents.map((inputComponent, i) => {
								return (
									inputComponentIsMatched(inputComponent.uniqueId) && (
										<Card key={i}>
											<Card.Body>
												<Card.Title>
													{inputComponent.label}
													<span className="text-muted small">
														{inputComponent.multi ? " (Multi)" : null}
													</span>
												</Card.Title>
												<Card.Text>
													<Button
														variant="light"
														onClick={() =>
															goToUniqueIDInMatchedBBCode(
																inputComponent.uniqueId
															)
														}>
														<FontAwesomeIcon icon="search" />
													</Button>
													{/* Leaving this commented out since copying from already matched fields probably isn't a use case */}
													{/* <CopyToClipboard
														text={inputComponent.uniqueId}
														onCopy={() =>
															SuccessToast(
																`🆔 for '${inputComponent.label}' copied to clipboard.`
															)
														}>
														<Button variant="light">
															<span role="img" aria-label="id">
																🆔
															</span>
														</Button>
													</CopyToClipboard> */}
													<Button
														variant="light"
														onClick={() =>
															deleteUniqueIDInMatchedBBCode(
																inputComponent.uniqueId
															)
														}>
														<FontAwesomeIcon icon="times"></FontAwesomeIcon>
													</Button>
												</Card.Text>
											</Card.Body>
										</Card>
									)
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
				</Container>
			</Col>
		</Row>
	);
};

export default FormBBCodeMatch;
