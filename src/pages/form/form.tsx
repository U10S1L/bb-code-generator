import "./form.css";

import { BBCodeForm, Field } from "types/formTypes";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	formatDateTimeWithSeconds,
	formatUrl,
	getDateString,
	getTimeString,
	parseBookmarkLink
} from "common/formatters";
import { getFormProgressString, getFormWithDefaultVals } from "common/utils";

import { AuthContext } from "context/authContext";
import CopyToClipboard from "react-copy-to-clipboard";
import { DefaultToast } from "components/toast/oldToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormRenderer from "components/form/renderer/formRenderer";
import StandardModal from "components/modals/standardModal";
import { useParams } from "react-router-dom";

const Form = () => {
	const params = useParams<{ uid: string }>();
	const { stateForms } = useContext(AuthContext);
	const [bbCodeForm, setBBCodeForm] = useState<BBCodeForm | undefined>();
	const [pageModal, setPageModal] = useState<{
		message: string;
		visible: boolean;
		continueAction: () => void;
	}>();
	const [formProgressString, setFormProgressString] = useState<
		string | undefined
	>();

	const generateBBCode = (): string => {
		if (bbCodeForm !== null && bbCodeForm !== undefined) {
			let fields: Field[] = JSON.parse(JSON.stringify(bbCodeForm.fields));
			const { matchedBBCode } = bbCodeForm;
			let generatedBBCode: string = matchedBBCode.concat();

			// Formatting for special Input Types
			fields.forEach((field) => {
				const { typeCode } = field.fieldType;
				field.inputs.forEach((input) => {
					if (typeCode === "checkbox") {
						input.val = input.val === "true" ? "[cbc]" : "[cb]";
					} else if (typeCode === "url") {
						input.val = formatUrl(JSON.parse(input.val));
					} else if (typeCode === "date") {
						input.val = getDateString(new Date(input.val));
					} else if (typeCode === "time") {
						input.val = getTimeString(new Date(input.val));
					} else if (typeCode === "dateTime") {
						const dateVal = new Date(input.val);
						input.val = getDateString(dateVal) + " " + getTimeString(dateVal);
					}

					if (field.multiStar) {
						input.val = `[*] ${input.val}`;
					}
				});
			});
			// Matching up Fields and replacing their IDs with the inputted vals
			fields.forEach((field) => {
				let fieldVal = ``;
				if (field.multi || field.multiStar) {
					/* Handle Multi Items */
					field.inputs.forEach((input) => {
						const indexOfInput = field.inputs.indexOf(input);
						if (indexOfInput === 0) {
							fieldVal += `${input.val}`;
						} else {
							fieldVal += `\n${input.val}`;
						}
					});
				} else {
					fieldVal =
						field.inputs[0].val !== undefined ? field.inputs[0].val : "";
				}
				// Creates a regex pattern to find the unique Id. Takes care to escape all special regex characters
				let regexpForUniqueId = new RegExp(
					field.uniqueId.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
					"g"
				);
				generatedBBCode = generatedBBCode.replace(regexpForUniqueId, fieldVal);
			});
			return generatedBBCode;
		} else {
			return "";
		}
	};

	const getOriginalBBCodeForm = useCallback(() => {
		return getFormWithDefaultVals(
			stateForms.find((form) => form.uid == params.uid)
		);
	}, [params.uid, stateForms]);

	const clearProg = () => {
		setBBCodeForm(getOriginalBBCodeForm());
		if (formProgressString) {
			localStorage.removeItem(formProgressString);
		}
	};

	useEffect(() => {
		// Initial loading of the BBCodeForm
		if (formProgressString) {
			const formProgress = localStorage.getItem(formProgressString);
			if (formProgress) {
				setBBCodeForm(JSON.parse(formProgress));
			}
		} else {
			setBBCodeForm(getOriginalBBCodeForm());
		}
	}, [params.uid, formProgressString, stateForms, getOriginalBBCodeForm]);

	useEffect(() => {
		// Saving current form progress in local storage
		if (formProgressString) {
			localStorage.setItem(formProgressString, JSON.stringify(bbCodeForm));
		}
	}, [bbCodeForm, formProgressString]);

	useEffect(() => {
		if (bbCodeForm) {
			setFormProgressString(getFormProgressString(bbCodeForm));
		}
	}, [params.uid, stateForms, bbCodeForm]);

	return bbCodeForm ? (
		<Row>
			<Col xs={12}>
				<div
					className="header"
					style={{
						justifyContent: "space-between",
						alignItems: "flex-start"
					}}>
					<div>
						<h4>{bbCodeForm.name}</h4>
						{bbCodeForm.progressTimestamp && (
							<h6 className="small text-muted">
								Auto Saved:{" "}
								{formatDateTimeWithSeconds(
									new Date(bbCodeForm.progressTimestamp)
								)}{" "}
							</h6>
						)}
					</div>

					<Button
						variant="dark"
						onClick={() =>
							setPageModal({
								visible: true,
								continueAction: clearProg,
								message: "This will clear your saved progress for this form."
							})
						}>
						Clear
					</Button>
				</div>
			</Col>
			<Col xs={12}>
				<FormRenderer
					bbCodeForm={bbCodeForm}
					onUpdateBBCodeForm={(updatedBBCodeForm) =>
						setBBCodeForm({
							...updatedBBCodeForm,
							progressTimestamp: Date.now()
						})
					}
				/>
			</Col>
			<Col
				xs={12}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-end",
					marginBottom: "1rem"
				}}>
				<ButtonGroup>
					<CopyToClipboard
						text={generateBBCode()}
						onCopy={() =>
							DefaultToast({ message: "BBCode Copied To Clipboard" })
						}>
						<Button variant={bbCodeForm.bookmarkLink ? "secondary" : "primary"}>
							Copy BBCode
						</Button>
					</CopyToClipboard>
					{bbCodeForm.bookmarkLink && (
						<CopyToClipboard
							text={generateBBCode()}
							onCopy={() => {
								window.open(parseBookmarkLink(bbCodeForm.bookmarkLink));
							}}>
							<Button variant="primary">
								<span style={{ marginRight: ".5rem" }}>
									Copy BBCode and Open
								</span>
								<FontAwesomeIcon icon={"bookmark"} />
							</Button>
						</CopyToClipboard>
					)}
				</ButtonGroup>
			</Col>

			<StandardModal
				visible={pageModal?.visible || false}
				handleClose={() =>
					setPageModal({
						visible: false,
						continueAction: () => null,
						message: ""
					})
				}
				handleContinue={pageModal?.continueAction}
				message={pageModal?.message}
				title="Warning"
				closeBtnText="Cancel"
				continueBtnText="Continue"
			/>
		</Row>
	) : null;
};

export default Form;
