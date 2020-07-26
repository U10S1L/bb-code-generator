import "./form.css";

import { BBCodeFormType, InputComponentProps } from "types/formTypes";
import { Button, Col, Row } from "react-bootstrap";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
	formatDate,
	formatDateTime,
	formatDateTimeWithSeconds,
	formatUrl
} from "formatters";

import { AppContext } from "context/context";
import CopyToClipboard from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormRenderer from "components/form/renderer/formRenderer";
import StandardModal from "components/modals/standardModal";
import { SuccessToast } from "components/toast/toast";

type FormParams = {
	slug: string;
};
type FormProps = RouteComponentProps<FormParams>;
const BBCodeForm: React.FC<FormProps> = ({ match }) => {
	const { state } = useContext(AppContext);

	const [pageModal, setPageModal] = useState<{
		message: string;
		visible: boolean;
		continueAction: () => void;
	}>();
	const [bbCodeForm, setBBCodeForm] = useState<BBCodeFormType>(
		state.forms.find((form) => form.slug === match.params.slug) || {
			uniqueId: "",
			slug: "",
			name: "",
			inputComponents: [],
			rawBBCode: "",
			matchedBBCode: "",
			createdTimestamp: Date.now(),
			updatedTimestamp: Date.now()
		}
	);
	const formProgressString = `formProgress_${bbCodeForm.uniqueId}`;

	const getOriginalBBCodeForm = useCallback(() => {
		let originalBBCodeForm = state.forms.find(
			(form) => form.uniqueId === bbCodeForm.uniqueId
		);
		if (originalBBCodeForm != null) {
			originalBBCodeForm = {
				...originalBBCodeForm,
				inputComponents: originalBBCodeForm.inputComponents.map(
					(inputComponent) => {
						return {
							...inputComponent,
							inputs: inputComponent.inputs.map((input) => {
								return {
									...input,
									val: inputComponent.defaultVal
								};
							})
						};
					}
				)
			};
			return originalBBCodeForm;
		}
		return {
			uniqueId: "",
			slug: "",
			name: "",
			inputComponents: [],
			rawBBCode: "",
			matchedBBCode: "",
			createdTimestamp: Date.now(),
			updatedTimestamp: Date.now()
		};
	}, [bbCodeForm.uniqueId, state.forms]);

	const generateBBCode = (): string => {
		var inputComponents: InputComponentProps[] = JSON.parse(
			JSON.stringify(bbCodeForm.inputComponents)
		);

		const { matchedBBCode } = bbCodeForm;
		var generatedBBCode: string = matchedBBCode.concat();

		// Format Vals if Necessary
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
	};

	const exportBBCodeForm = () => {
		// Sanitize the BBCode Form before exporting
		var sanitizedBBCodeForm = state.forms.find(
			(form) => form.uniqueId === bbCodeForm.uniqueId
		);
		if (sanitizedBBCodeForm != null) {
			sanitizedBBCodeForm = {
				...sanitizedBBCodeForm,
				uniqueId: "",
				slug: ""
			};
		}

		var dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(sanitizedBBCodeForm));
		var downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute(
			"download",
			`${bbCodeForm.uniqueId}FormExport.json`
		);
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	useEffect(() => {
		// Initial loading of the BBCodeForm
		const formProgress = localStorage.getItem(formProgressString);
		if (formProgress == null) {
			setBBCodeForm(getOriginalBBCodeForm());
		} else {
			setBBCodeForm(JSON.parse(formProgress));
		}
	}, [
		match.params.slug,
		state.forms,
		formProgressString,
		getOriginalBBCodeForm
	]);

	useEffect(() => {
		// Saving current form progress in local storage
		localStorage.setItem(formProgressString, JSON.stringify(bbCodeForm));
	}, [bbCodeForm, formProgressString]);

	return (
		<Row>
			<Col xs={12}>
				<div
					className="header"
					style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
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
								continueAction: () => setBBCodeForm(getOriginalBBCodeForm),
								message:
									"This will erase any values in the form fields. Do you want to continue?"
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
				<Button variant="primary" onClick={() => exportBBCodeForm()}>
					<FontAwesomeIcon icon="download" /> Export{" "}
				</Button>

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
	);
};

export default withRouter(BBCodeForm);
