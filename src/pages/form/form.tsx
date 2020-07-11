import React, { useContext, useState, useEffect, useCallback } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import FormRenderer from "../../components/Form/Renderer/formRenderer";
import { AppContext, BBCodeFormType } from "../../context";
import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import FormCreator from "./creator/formCreator";
import { Types } from "../../reducers";
import { SuccessToast } from "../../components/Toast/toast";
import CopyToClipboard from "react-copy-to-clipboard";
import { formatDateTime, formatDate, formatUrl } from "../../formatters";
import { InputComponentProps } from "../../types/form";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StandardModal from "../../components/Modals/standardModal";

type FormParams = {
	slug: string;
};
type FormProps = RouteComponentProps<FormParams>;
const BBCodeForm: React.FC<FormProps> = ({ match }) => {
	const { state, dispatch } = useContext(AppContext);
	const [pageModal, setPageModal] = useState<{
		message: string;
		visible: boolean;
		continueAction: () => void;
	}>();
	let history = useHistory();

	const [bbCodeForm, setBBCodeForm] = useState<BBCodeFormType>(
		state.forms.find((form) => form.slug === match.params.slug) || {
			uniqueId: "",
			slug: "",
			name: "",
			inputComponents: [],
			rawBBCode: "",
			matchedBBCode: ""
		}
	);
	const formProgressString = `formProgress_${bbCodeForm.uniqueId}`;
	const [editMode, setEditMode] = useState(false);

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
			matchedBBCode: ""
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
							? `\n[*] ${input.val}\n`
							: `[*] ${input.val}\n`;
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

	const editBBCodeForm = () => {
		// TODO: Warning first

		localStorage.removeItem(formProgressString);
		localStorage.setItem(
			"editBBCodeForm",
			JSON.stringify(getOriginalBBCodeForm())
		);
		setEditMode(true);
	};
	const saveEdits = (bbCodeForm: BBCodeFormType) => {
		localStorage.removeItem("editBBCodeForm");
		dispatch({ type: Types.UpdateForm, payload: bbCodeForm });
		setEditMode(false);
	};

	const deleteBBCodeForm = () => {
		// TODO: Some kind of warning like you can't undo this. And then navigate to home page
		localStorage.removeItem(formProgressString);
		dispatch({ type: Types.DeleteForm, payload: bbCodeForm });
		history.push("/forms/list");
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
		if (formProgress != null) {
			setBBCodeForm(JSON.parse(formProgress));
		} else {
			setBBCodeForm(getOriginalBBCodeForm());
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

	return !editMode ? (
		<Row>
			<Col xs={12}>
				<div className="header">
					<h3 className="mr-auto ml-0">{bbCodeForm.name}</h3>
					<ButtonGroup>
						<Button
							variant="warning"
							onClick={() =>
								setPageModal({
									visible: true,
									continueAction: () => setBBCodeForm(getOriginalBBCodeForm),
									message:
										"This will erase the values in all of the form fields. Do you want to continue?"
								})
							}>
							Clear Progress
						</Button>
						<Button
							variant="secondary"
							onClick={() =>
								setPageModal({
									visible: true,
									continueAction: () => editBBCodeForm(),
									message:
										"Editing the form will erase any values you've filled out. Do you want to continue?"
								})
							}>
							Edit Form
						</Button>
						<Button variant="danger" onClick={() => deleteBBCodeForm()}>
							Delete Form
						</Button>
					</ButtonGroup>
				</div>
			</Col>
			<Col xs={12}>
				<FormRenderer
					bbCodeForm={bbCodeForm}
					onUpdateBBCodeForm={(updatedBBCodeForm) =>
						setBBCodeForm(updatedBBCodeForm)
					}
				/>
			</Col>
			<Col xs={12}>
				<CopyToClipboard
					text={generateBBCode()}
					onCopy={() => SuccessToast("BBCode Copied To Clipboard")}>
					<Button variant="info">Generate BBCode</Button>
				</CopyToClipboard>
				<Button
					variant="primary"
					style={{ float: "right" }}
					onClick={() => exportBBCodeForm()}>
					<FontAwesomeIcon icon="download" /> Export
				</Button>
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
	) : (
		<FormCreator editMode={true} saveEdits={saveEdits} />
	);
};

export default withRouter(BBCodeForm);
