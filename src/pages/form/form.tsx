import "./form.css";

import { BBCodeFormType, InputComponentProps } from "types/formTypes";
import { Button, Col, Row } from "react-bootstrap";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	formatDate,
	formatDateTime,
	formatDateTimeWithSeconds,
	formatUrl
} from "formatters";
import { getFormProgressString, getFormWithDefaultVals } from "formatters";

import { AuthContext } from "context/authContext";
import CopyToClipboard from "react-copy-to-clipboard";
import FormRenderer from "components/form/renderer/formRenderer";
import StandardModal from "components/modals/standardModal";
import { SuccessToast } from "components/toast/toast";
import { useParams } from "react-router-dom";

const BBCodeForm = () => {
	const params = useParams<{ uid: string }>();
	const { stateForms } = useContext(AuthContext);
	const [bbCodeForm, setBBCodeForm] = useState<BBCodeFormType | undefined>();
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
			var inputComponents: InputComponentProps[] = JSON.parse(
				JSON.stringify(bbCodeForm.inputComponents)
			);
			const { matchedBBCode } = bbCodeForm;
			var generatedBBCode: string = matchedBBCode.concat();

			// Formatting for special Input Types
			inputComponents.forEach((inputComponent) => {
				inputComponent.inputs.forEach((input) => {
					if (inputComponent.type === "dateTime") {
						input.val = formatDateTime(new Date(input.val));
					} else if (inputComponent.type === "checkbox") {
						input.val = input.val === "true" ? "[cbc]" : "[cb]";
					} else if (inputComponent.type === "date") {
						input.val = formatDate(new Date(input.val));
					} else if (inputComponent.type === "url") {
						input.val = formatUrl(JSON.parse(input.val));
					} else if (inputComponent.type === "listItem") {
						input.val = `[*] ${input.val}`;
					}
				});
			});
			// Matching up Fields and replacing their IDs with the inputted vals
			inputComponents.forEach((inputComponent) => {
				var inputComponentVal = ``;
				if (inputComponent.multi) {
					inputComponent.inputs.forEach((input) => {
						inputComponentVal +=
							inputComponent.inputs.indexOf(input) === 0 ||
							inputComponent.inputs.indexOf(input) ===
								inputComponent.inputs.length
								? `\n${input.val}\n`
								: `${input.val}\n`;
					});
				} else {
					inputComponentVal =
						inputComponent.inputs[0].val !== undefined
							? inputComponent.inputs[0].val
							: "";
				}
				// Creates a regex pattern to find the unique Id. Takes care to escape all special regex characters
				var regexpForUniqueId = new RegExp(
					inputComponent.uniqueId.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
					"g"
				);
				generatedBBCode = generatedBBCode.replace(
					regexpForUniqueId,
					inputComponentVal
				);
			});
			return generatedBBCode;
		} else {
			return "";
		}
	};

	const getOriginalBBCodeForm = useCallback(() => {
		return getFormWithDefaultVals(
			stateForms.find((form) => form.uid === params.uid)
		);
	}, [params.uid, stateForms]);

	const clearProg = () => {
		if (formProgressString) {
			localStorage.removeItem(formProgressString);
		}
		setBBCodeForm(getOriginalBBCodeForm());
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
						<h3>{bbCodeForm.name}</h3>
						{bbCodeForm.progressTimestamp && (
							<h6 className="small text-muted">
								Auto Saved:{" "}
								{formatDateTimeWithSeconds(
									new Date(bbCodeForm.progressTimestamp)
								)}{" "}
								(Local Time)
							</h6>
						)}
					</div>

					<Button
						variant="secondary"
						onClick={() =>
							setPageModal({
								visible: true,
								continueAction: clearProg,
								message:
									"You are about to erase all the the values in the form fields."
							})
						}>
						Clear
					</Button>
				</div>
			</Col>
			<Col xs={12} className="mt-3">
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
			<Col xs={12} style={{ display: "flex", alignItems: "center" }}>
				<CopyToClipboard
					text={generateBBCode()}
					onCopy={() => SuccessToast("BBCode Copied To Clipboard")}>
					<Button variant="info" style={{ marginLeft: "auto" }}>
						Generate BBCode
					</Button>
				</CopyToClipboard>
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

export default BBCodeForm;
