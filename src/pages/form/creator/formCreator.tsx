import "./formCreator.css";
import React, { Fragment, useState, useEffect, useContext } from "react";
import { AppContext, BBCodeFormType } from "../../../context";
import FormSetupCreator from "../../../components/Form/Creator/Setup/formSetupCreator";
import FormInputCreator from "../../../components/Form/Creator/Input/formInputCreator";
import FormBBCodeMatch from "../../../components/Form/Creator/BBCode/Match/formBBCodeMatch";
import FormBBCodeUpload from "../../../components/Form/Creator/BBCode/Upload/formBBCodeUpload";
import { useHistory } from "react-router-dom";
import { InputComponentProps } from "../../../types/form";
import { Button, ProgressBar, Row, Col } from "react-bootstrap";
import arrayMove from "array-move";
import { Types } from "../../../reducers";
import { ErrorToast } from "../../../components/Toast/toast";
import Help from "../../../components/Help/help";
var slugify = require("slugify");

export enum FormCreationStep {
	FORM_SETUP = "Form Setup",
	INPUT_CREATION = "Input Creation",
	BBCODE_UPLOAD = "Raw BBCode Upload",
	BBCODE_MATCH = "BBCode Match"
}
const formCreationStepEnums = [
	FormCreationStep.FORM_SETUP,
	FormCreationStep.INPUT_CREATION,
	FormCreationStep.BBCODE_UPLOAD,
	FormCreationStep.BBCODE_MATCH
];

type FormCreatorProps = {
	editMode: boolean;
	saveEdits: (bbCodeForm: BBCodeFormType) => void;
};

const FormCreator = ({ editMode, saveEdits }: FormCreatorProps) => {
	const { state, dispatch } = useContext(AppContext);
	const [formCreationStep, setFormCreationStep] = useState(
		FormCreationStep.FORM_SETUP
	);

	const [bbCodeForm, setBBCodeForm] = useState<BBCodeFormType>({
		uniqueId: "",
		slug: "",
		name: "",
		inputComponents: [],
		rawBBCode: "",
		matchedBBCode: ""
	});

	const [originalBBCodeForm, setOriginalBBCodeForm] = useState<BBCodeFormType>({
		uniqueId: "",
		slug: "",
		name: "",
		inputComponents: [],
		rawBBCode: "",
		matchedBBCode: ""
	});

	const getHelpTitle = () => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				return `<ins>Form Setup</ins>`;
			case FormCreationStep.INPUT_CREATION:
				return `<ins>Input Creation</ins>`;
			default:
				return ``;
		}
	};

	const getHelpText = () => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				return `
				<b>1: Enter a name for your form.</b>
				<br><img src="https://i.imgur.com/pr1Arp0.gif" class="w-100"/>
				<br><br>
				<b>Optional: "Start From File"</b>
				<br>
				Drag and drop to start from a previously exported file, if you have one.
				`;
			case FormCreationStep.INPUT_CREATION:
				return `
				<b>1: Create text boxes of the appropriate input types.</b>
				<br><small>Hint: the Label should be similar to the text on the left side of the colon in the BB Code Form.</small>
				<br>
				<b>2: Fill in the information for the new input:</b>
				<br>Label: required. Appears above the text box on the form.
				<br>Description: optional. Will appear under the label on the form.
				<br>Default Value: optional. Will auto populate the text box with a default value on the form.
				<br><br>
				<b>Repeat steps 1 & 2 for all of the inputs on the form.</b>
				
				<br><img src="https://i.imgur.com/L4Ajbae.gif" class="w-100"/>

				<br>Hint: Look at the "Form Preview to catch a sneak peak of the finished product!" 
				`;

			case FormCreationStep.BBCODE_UPLOAD:
				return `
				<b>1: Copy and paste the raw, unedited BB Code for the form.</b>
				<br><img src="https://i.imgur.com/FxiuKVt.gif" class="w-100"/>
				`;
			case FormCreationStep.BBCODE_MATCH:
				return `
				<b>1: Copy and paste the 🆔s for each input into the BB Code.</b>
				<br><small>The 🆔 may look like jibberish, but don't worry - that's intentional.</small>
				<br>
				You should paste the 🆔 on the form in the same place that you would ordinarily type. 
				<br><br>
				For inputs that you marked as [*], the 🆔 should be the sole member between <code>[list][/list]</code>.
				<br>
				<img src="https://i.imgur.com/TYIQk0E.gif" class="w-100"/>
				`;
			default:
				return ``;
		}
	};

	let history = useHistory();

	// Form Creation Step
	const incrementFormCreationStep = (): void => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				if (doesFormNameExist()) {
					ErrorToast(`Form name must not already exist.`);
				} else {
					setFormCreationStep(FormCreationStep.INPUT_CREATION);
				}
				break;
			case FormCreationStep.INPUT_CREATION:
				setFormCreationStep(FormCreationStep.BBCODE_UPLOAD);
				break;
			case FormCreationStep.BBCODE_UPLOAD:
				setFormCreationStep(FormCreationStep.BBCODE_MATCH);
				break;
			case FormCreationStep.BBCODE_MATCH:
				dispatch({
					type: Types.AddForm,
					payload: {
						...bbCodeForm,
						uniqueId: `{<${bbCodeForm.name}>_${
							Math.floor(Math.random() * (9999 - 0)) + 0
						}}`,
						slug: slugify(bbCodeForm.name)
					}
				});
				history.push(`/form/${slugify(bbCodeForm.name)}`);
				localStorage.removeItem("newBBCodeForm");
				break;
		}
	};
	const decrementFormCreationStep = (): void => {
		switch (formCreationStep) {
			case FormCreationStep.INPUT_CREATION:
				setFormCreationStep(FormCreationStep.FORM_SETUP);
				break;
			case FormCreationStep.BBCODE_UPLOAD:
				setFormCreationStep(FormCreationStep.INPUT_CREATION);
				break;
			case FormCreationStep.BBCODE_MATCH:
				setFormCreationStep(FormCreationStep.BBCODE_UPLOAD);
				break;
		}
	};

	// Form Name
	const updateFormName = (newName: string) => {
		setBBCodeForm({
			...bbCodeForm,
			name: newName
		});
	};
	const doesFormNameExist = () => {
		if (!editMode) {
			return state.forms.find((form) => form.name === bbCodeForm.name) != null;
		} else {
			return (
				state.forms.find(
					(form) =>
						form.name !== originalBBCodeForm.name &&
						form.name === bbCodeForm.name
				) != null
			);
		}
	};

	// Form Input Components
	const addSelectedInputComponent = (
		inputComponent: InputComponentProps
	): void => {
		if (bbCodeForm.inputComponents == null) {
			setBBCodeForm({
				...bbCodeForm,
				inputComponents: [inputComponent]
			});
		} else {
			setBBCodeForm({
				...bbCodeForm,
				inputComponents: bbCodeForm.inputComponents.concat(inputComponent)
			});
		}
	};
	const updateSelectedInputComponent = (
		newInputComponent: InputComponentProps
	): void => {
		setBBCodeForm({
			...bbCodeForm,
			inputComponents: bbCodeForm.inputComponents.map((currInputComponent) =>
				currInputComponent.uniqueId === newInputComponent.uniqueId
					? newInputComponent
					: currInputComponent
			)
		});
	};
	const removeSelectedInputComponent = (
		selectedInputComponentUniqueId: string
	) => {
		var regexpSelectedInputComponentUniqueId = new RegExp(
			selectedInputComponentUniqueId,
			"g"
		);
		var newMatchedBBCode = bbCodeForm.matchedBBCode
			.slice()
			.replace(regexpSelectedInputComponentUniqueId, "");

		setBBCodeForm({
			...bbCodeForm,
			matchedBBCode: newMatchedBBCode,
			inputComponents: bbCodeForm.inputComponents.filter(
				(selectedInput) =>
					selectedInput.uniqueId !== selectedInputComponentUniqueId
			)
		});
	};
	const reorderSelectedInputComponents = (sortObject: {
		oldIndex: number;
		newIndex: number;
	}) => {
		setBBCodeForm({
			...bbCodeForm,
			inputComponents: arrayMove(
				bbCodeForm.inputComponents,
				sortObject.oldIndex,
				sortObject.newIndex
			)
		});
	};

	const saveEditedBBCodeForm = () => {
		if (doesFormNameExist()) {
			ErrorToast("Form name already exists.");
		} else {
			saveEdits(bbCodeForm);
		}
	};

	const cancelEditBBCodeForm = () => {
		saveEdits(originalBBCodeForm);
	};

	// Form BB Code
	const updateRawBBCode = (rawBBCode: string) => {
		setBBCodeForm({
			...bbCodeForm,
			rawBBCode,
			matchedBBCode: rawBBCode
		});
	};
	const updateMatchedBBCode = (matchedBBCode: string) => {
		setBBCodeForm({ ...bbCodeForm, matchedBBCode });
	};

	useEffect(() => {
		// Initial load, get form from local storage
		const bbCodeFormString = localStorage.getItem(
			editMode ? "editBBCodeForm" : "newBBCodeForm"
		);
		if (bbCodeFormString != null) {
			setBBCodeForm(JSON.parse(bbCodeFormString));
			setOriginalBBCodeForm(JSON.parse(bbCodeFormString));
		}
	}, [editMode]);

	useEffect(() => {
		// Save form in local storage on every edit
		localStorage.setItem(
			editMode ? "editBBCodeForm" : "newBBCodeForm",
			JSON.stringify(bbCodeForm)
		);
	}, [bbCodeForm, editMode]);

	return (
		<Fragment>
			<Row>
				<Col xs={12}>
					<div className="header">
						{formCreationStep !== FormCreationStep.FORM_SETUP && (
							<Button
								variant="secondary"
								onClick={() => decrementFormCreationStep()}>
								Back
							</Button>
						)}
						<h3>{formCreationStep}</h3>

						{(formCreationStep !== FormCreationStep.BBCODE_MATCH ||
							!editMode) && (
							<Button
								variant="info"
								onClick={() => incrementFormCreationStep()}
								disabled={
									(formCreationStep === FormCreationStep.FORM_SETUP &&
										bbCodeForm.name === "") ||
									(formCreationStep === FormCreationStep.INPUT_CREATION &&
										(bbCodeForm.inputComponents == null ||
											bbCodeForm.inputComponents.length === 0)) ||
									(formCreationStep === FormCreationStep.BBCODE_UPLOAD &&
										bbCodeForm.rawBBCode === "")
								}>
								{(formCreationStep === FormCreationStep.FORM_SETUP ||
									formCreationStep === FormCreationStep.INPUT_CREATION ||
									formCreationStep === FormCreationStep.BBCODE_UPLOAD) &&
									"Next"}
								{formCreationStep === FormCreationStep.BBCODE_MATCH && "Save"}
							</Button>
						)}
					</div>
					<ProgressBar
						now={
							((formCreationStepEnums.indexOf(formCreationStep) + 1) /
								formCreationStepEnums.length) *
							100
						}
						label={`${formCreationStepEnums.indexOf(formCreationStep) + 1} / 4`}
						variant="info"
					/>
				</Col>
			</Row>
			{formCreationStep === FormCreationStep.FORM_SETUP && (
				<FormSetupCreator
					val={bbCodeForm.name}
					setVal={updateFormName}
					loadBBCodeForm={(bbCodeForm: BBCodeFormType) =>
						setBBCodeForm(bbCodeForm)
					}
				/>
			)}

			{formCreationStep === FormCreationStep.INPUT_CREATION && (
				<FormInputCreator
					newBBCodeForm={bbCodeForm}
					addInput={addSelectedInputComponent}
					updateInput={updateSelectedInputComponent}
					removeInput={removeSelectedInputComponent}
					reorderSelectedInputComponents={reorderSelectedInputComponents}
				/>
			)}
			{formCreationStep === FormCreationStep.BBCODE_UPLOAD && (
				<FormBBCodeUpload
					rawBBCode={bbCodeForm.rawBBCode}
					setRawBBCode={updateRawBBCode}
				/>
			)}
			{formCreationStep === FormCreationStep.BBCODE_MATCH && (
				<FormBBCodeMatch
					selectedInputComponents={bbCodeForm.inputComponents}
					matchedBBCode={bbCodeForm.matchedBBCode}
					setMatchedBBCode={updateMatchedBBCode}
				/>
			)}
			{editMode && (
				<Row style={{ marginTop: "3rem" }}>
					<Col xs={12}>
						<Button
							style={{ float: "right" }}
							variant="danger"
							onClick={() => cancelEditBBCodeForm()}>
							Cancel Edits
						</Button>

						<Button
							style={{ float: "right" }}
							variant="success"
							onClick={() => saveEditedBBCodeForm()}>
							Save Edits
						</Button>
					</Col>
				</Row>
			)}
			<Help title={getHelpTitle()} text={getHelpText()}></Help>
		</Fragment>
	);
};
export default FormCreator;
