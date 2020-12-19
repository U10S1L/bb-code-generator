import { Button, Card, Col, Row } from "react-bootstrap";
import React, { useRef } from "react";

import CopyToClipboard from "react-copy-to-clipboard";
import { DefaultToast } from "components/toast/oldToast";
import { Field } from "types/formTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionMarkTooltip } from "components/help/tooltip/tooltips";
import TextAreaAutosize from "react-textarea-autosize";

type FormBBCodeMatchProps = {
	selectedFields: Field[];
	matchedBBCode: string;
	setMatchedBBCode: (bbCode: string) => void;
};
type CopyToClipboardButtonProps = {
	field: Field;
};

const genFieldDescription = (field: Field) => {
	const { multiStar } = field;
	const { typeCode } = field.fieldType;
	var description = "";
	if (typeCode === "checkbox") {
		description += `Renders as a [cb] or [cbc]. `;
	} else if (typeCode === "url") {
		return `Replace [url][/url] with 🆔. `;
	}

	if (multiStar) {
		description += `Paste like [list]🆔[/list]. `;
	}

	return description;
};

const CopyToClipboardButton = ({ field }: CopyToClipboardButtonProps) => {
	return (
		<CopyToClipboard
			text={field.uniqueId}
			onCopy={() => {
				DefaultToast({
					message: `'${field.label}' 🆔 copied. ${genFieldDescription(field)}`
				});
			}}>
			<Button variant="dark">
				<span role="img" aria-label="id">
					🆔
				</span>
			</Button>
		</CopyToClipboard>
	);
};

const FormBBCodeMatch = ({
	selectedFields,
	matchedBBCode,
	setMatchedBBCode
}: FormBBCodeMatchProps) => {
	const matchedBBCodeRef = useRef<HTMLTextAreaElement>(null!);
	const isFieldMatched = (uniqueId: string) => {
		return matchedBBCode.includes(uniqueId);
	};

	const goToUniqueIdInMatchedBBCode = (uniqueId: string) => {
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
			goToUniqueIdInMatchedBBCode(uniqueId);
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
						{selectedFields.map((field, i) => {
							const matched = isFieldMatched(field.uniqueId);
							return (
								<Card key={i} style={{ borderRadius: 0, margin: ".25rem 0" }}>
									<Card.Body>
										<Card.Title style={{ marginBottom: ".35rem" }}>
											{field.label}
										</Card.Title>
										<Card.Subtitle style={{ marginBottom: ".75rem" }}>
											<span className="small" style={{ opacity: ".65" }}>
												{genFieldDescription(field)}
											</span>
										</Card.Subtitle>
										{!matched ? (
											<div style={{ display: "flex", alignItems: "center" }}>
												<CopyToClipboardButton field={field} />
												<span style={{ color: "red", marginLeft: "auto" }}>
													Unmatched
												</span>
											</div>
										) : (
											<div style={{ display: "flex", alignItems: "center" }}>
												<CopyToClipboardButton field={field} />
												<Button
													variant="link"
													onClick={() =>
														goToUniqueIdInMatchedBBCode(field.uniqueId)
													}>
													<FontAwesomeIcon icon="search" />
												</Button>
												<Button
													variant="link"
													onClick={() =>
														deleteUniqueIDInMatchedBBCode(field.uniqueId)
													}>
													<FontAwesomeIcon color="red" icon="times"></FontAwesomeIcon>
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
