import React, { useRef } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputComponentProps } from "../../../../../types/form";
import { SuccessToast } from "../../../../Toast/toast";
import CopyToClipboard from "react-copy-to-clipboard";
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

	return (
		<Row>
			<Col xs={12}>
				<Container className="h-100">
					<Row className="h-100">
						<Col xs={4}>
							<h5>Not Matched</h5>
							{selectedInputComponents.map((inputComponent, i) => {
								return (
									!inputComponentIsMatched(inputComponent.uniqueId) && (
										<Card key={i}>
											<Card.Body>
												<Card.Title>
													{inputComponent.label}
													{inputComponent.multi ? " [*]" : null}
												</Card.Title>
												<Card.Text>
													<CopyToClipboard
														text={inputComponent.uniqueId}
														onCopy={() =>
															SuccessToast(
																`🆔 for '${inputComponent.label}' copied.`
															)
														}>
														<Button variant="light">
															<FontAwesomeIcon icon="clipboard" />
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
							<h5>Matched</h5>
							{selectedInputComponents.map((inputComponent, i) => {
								return (
									inputComponentIsMatched(inputComponent.uniqueId) && (
										<Card key={i}>
											<Card.Body>
												<Card.Title>
													{inputComponent.label}
													{inputComponent.multi ? " [*]" : null}
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
													<CopyToClipboard
														text={inputComponent.uniqueId}
														onCopy={() =>
															SuccessToast(
																`🆔 for '${inputComponent.label}' copied.`
															)
														}>
														<Button variant="light">
															<FontAwesomeIcon icon="clipboard" />
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
						</Col>
						<Col xs={8}>
							<h5>
								Paste in the{" "}
								<span role="img" aria-label="id">
									🆔
								</span>
								s{" "}
							</h5>
							<TextAreaAutosize
								ref={matchedBBCodeRef}
								className="form-control h-100"
								value={matchedBBCode}
								onChange={(e) => setMatchedBBCode(e.target.value)}
							/>
						</Col>
					</Row>
				</Container>
			</Col>
		</Row>
	);
};

export default FormBBCodeMatch;
