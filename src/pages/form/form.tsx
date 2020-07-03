import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import FormRenderer from "../../components/Form/Renderer/formRenderer";
import { AppContext, BBCodeFormType } from "../../context";
import { Button } from "react-bootstrap";
import FormCreator from "./creator/formCreator";
import { Types } from "../../reducers";
import { SuccessToast } from "../../components/Toast/toast";
import CopyToClipboard from "react-copy-to-clipboard";
import { formatDateTime } from "../../formatters";
import { InputComponentProps } from "../../types/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

type FormParams = {
	slug: string;
};

type FormProps = RouteComponentProps<FormParams>;

const BBCodeForm: React.FC<FormProps> = ({ match }) => {
	const { state, dispatch } = useContext(AppContext);
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

	const [editMode, setEditMode] = useState(false);

	const generateBBCode = (): string => {
		// Depp Clone
		var inputComponents: InputComponentProps[] = JSON.parse(
			JSON.stringify(bbCodeForm.inputComponents)
		);

		const matchedBBCode: string = bbCodeForm.matchedBBCode;
		var generatedBBCode: string = matchedBBCode;

		// Format values where needed
		inputComponents.map((inputComponent) => {
			inputComponent.inputs.map((input) => {
				if (input.type === "dateTime") {
					input.val = formatDateTime(new Date(input.val));
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
				inputComponentVal = inputComponent.inputs[0].val;
			}

			const regexpForUniqueId = new RegExp(inputComponent.uniqueId, "g");
			generatedBBCode = generatedBBCode.replace(
				regexpForUniqueId,
				inputComponentVal
			);
		});
		return generatedBBCode;
	};

	const editBBCodeForm = () => {
		setEditMode(true);
		localStorage.setItem("editBBCodeForm", JSON.stringify(bbCodeForm));
	};
	const saveEdits = (bbCodeForm: BBCodeFormType) => {
		setEditMode(false);
		localStorage.setItem(
			`formProgress_${bbCodeForm.uniqueId}`,
			JSON.stringify(bbCodeForm)
		);
		setBBCodeForm(bbCodeForm);
		dispatch({ type: Types.UpdateForm, payload: bbCodeForm });
		localStorage.removeItem("editBBCodeForm");
	};

	const deleteBBCodeForm = () => {
		// TODO: Some kind of warning like you can't undo this. And then navigate to home page
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

	const clearFormProgress = () => {
		//TOOD: add a warning pop up first
		let originalBBCodeForm = state.forms.find(
			(form) => form.uniqueId === bbCodeForm.uniqueId
		);
		if (originalBBCodeForm != null) {
			setBBCodeForm(originalBBCodeForm);
		} else {
			setBBCodeForm({
				uniqueId: "",
				slug: "",
				name: "",
				inputComponents: [],
				rawBBCode: "",
				matchedBBCode: ""
			});
		}
	};

	useEffect(() => {
		// Initial loading of the BBCodeForm
		const formProgressString = localStorage.getItem(
			`formProgress_${bbCodeForm.uniqueId}`
		);
		if (formProgressString != null) {
			setBBCodeForm(JSON.parse(formProgressString));
		} else {
			setBBCodeForm(
				state.forms.find((form) => form.slug === match.params.slug) || {
					uniqueId: "",
					slug: "",
					name: "",
					inputComponents: [],
					rawBBCode: "",
					matchedBBCode: ""
				}
			);
		}
	}, [match.params.slug, state.forms]);

	useEffect(() => {
		// Saving current form progress in local storage
		localStorage.setItem(
			`formProgress_${bbCodeForm.uniqueId}`,
			JSON.stringify(bbCodeForm)
		);
	}, [bbCodeForm]);

	return !editMode ? (
		<div>
			<div className="header">
				<h3>{bbCodeForm.name}</h3>
				<Button
					className="ml-auto"
					variant="info"
					onClick={() => editBBCodeForm()}>
					Edit Form
				</Button>
				<Button variant="danger" onClick={() => deleteBBCodeForm()}>
					Delete Form
				</Button>
				<Button onClick={() => exportBBCodeForm()}>Export</Button>
				<Button onClick={() => clearFormProgress()}>
					Clear Stored Form Progress
				</Button>
			</div>

			<FormRenderer
				bbCodeForm={bbCodeForm}
				onUpdateBBCodeForm={(updatedBBCodeForm) =>
					setBBCodeForm(updatedBBCodeForm)
				}
			/>
			<CopyToClipboard
				text={generateBBCode()}
				onCopy={() => SuccessToast("BBCode Copied To Clipboard")}>
				<Button>Generate BBCode</Button>
			</CopyToClipboard>
		</div>
	) : (
		<FormCreator editMode={true} saveEdits={saveEdits} />
	);
};

export default withRouter(BBCodeForm);
