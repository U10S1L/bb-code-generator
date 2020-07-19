import React, { Fragment, useState, useEffect, useContext } from "react";
import { AppContext, BBCodeFormType } from "../../../context";
import FormSetupCreator from "../../../components/Form/Creator/Setup/formSetupCreator";
import FormInputCreator from "../../../components/Form/Creator/Input/formInputCreator";
import FormBBCodeMatch from "../../../components/Form/Creator/BBCode/Match/formBBCodeMatch";
import FormBBCodeUpload from "../../../components/Form/Creator/BBCode/Upload/formBBCodeUpload";
import { useHistory } from "react-router-dom";
import { InputComponentProps } from "../../../types/form";
import { Button, Row, Col } from "react-bootstrap";
import arrayMove from "array-move";
import { Types } from "../../../reducers";
import { ErrorToast } from "../../../components/Toast/toast";
import Help from "../../../components/Help/help";
var slugify = require("slugify");

export enum FormCreationStep {
	FORM_SETUP = "Form Setup",
	BBCODE_UPLOAD = "Raw BBCode Upload",
	FIELD_CREATION = "Field Creation",
	BBCODE_MATCH = "BBCode Match"
}

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
		matchedBBCode: "",
		createdTimestamp: Date.now(),
		updatedTimestamp: Date.now()
	});

	const [originalBBCodeForm, setOriginalBBCodeForm] = useState<BBCodeFormType>({
		uniqueId: "",
		slug: "",
		name: "",
		inputComponents: [],
		rawBBCode: "",
		matchedBBCode: "",
		createdTimestamp: Date.now(),
		updatedTimestamp: Date.now()
	});

	const getHelpTitle = () => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				return `<ins>Form Setup</ins>`;
			case FormCreationStep.FIELD_CREATION:
				return `<ins>Field Creation</ins>`;
			default:
				return ``;
		}
	};

	const getHelpText = () => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				return `
				<b>Enter a name for the new form and then press "Next"</b>
				<br><img src="https://i.imgur.com/pr1Arp0.gif" class="w-100"/>
				<br><br>
				<b>Optional: "Start From File"</b>
				<br>
				You can drag and drop the file from a previously exported form here, if you have one.
				`;
			case FormCreationStep.FIELD_CREATION:
				return `
				A BBCode form has <b>fields</b>. Each <b>field</b> contains two parts: a <b>label</b>, and an <b>value</b>.
				<br>
				<img src="https://i.imgur.com/PNgBpKY.png" class="img-fluid"/>
				<br><br><br>
				<b>1: Select the most appropriate Input Type for the field you're adding.</b> 
				<br>
				<small>
				- <b>Text Line</b>: Names, ranks, badge numbers, locations, etc.
				<br>
				- <b>Text Box</b>: Narratives, statements, etc.
				<br>
				- <b>Date & Time</b>: Any field requring a date & time together. Will format as DD/MMM/YYYY HH:MM
				<br>
				- <b>Date</b>: Will format as DD/MMM/YYYY.
				<br>
				- <b>Time</b>: Just a time, man.
				<br>
				- <b>Dropdown</b>: Good for when you know the options for a field. Example: "Evidence type", which is always MELEE, NARCOTICS, WEAPONS, or OTHER.
				<br>
				- <b>Checkbox</b>: Will render a [cb] (if it's unchecked) or [cbc] (if it's checked) when generating the BBCode.
				</small>
				<br>
				<br>
				<b>2: Fill in the details for the new field.</b>
				<br>
				<small>
				- <b>Label</b>: required, will tell you which field you're filling in.
				<br>
				- <b>Description</b>: optional. Appears under the field's label (good for reminders, etc).
				<br>
				- <b>Default Value</b>: optional. Auto populates the field's value.
				<br>
				- <b>Multi</b>: Allow you to add more than one value for this field. Each value generates on a new line. (Remember to put [*] in the default value (if you have one) if the Multi field is between [list][/list] tags!).
				</small>
				<br>
				<br>
				<b>Repeat steps 1 & 2 for all of the fields on the form.</b>
				<br>
				<img src="https://i.imgur.com/L4Ajbae.gif" class="w-100"/>
				<br>
				Hint: Look at the "Form Preview to catch a sneak peak of the finished product!" 
				`;

			case FormCreationStep.BBCODE_UPLOAD:
				return `
				<b>1: Copy and paste the raw, unedited BBCode.</b>
				<br><img src="https://i.imgur.com/ILgFqUc.gif" class="w-100"/>
				`;
			case FormCreationStep.BBCODE_MATCH:
				return `
				<b>1: Copy and paste the 🆔s for each field into the BB Code where you would ordinarily type the value.</b>
				<br>
				<small>- The 🆔 may look like jibberish, but don't worry - that's intentional.</small>
				<br>
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
					setFormCreationStep(FormCreationStep.BBCODE_UPLOAD);
				}
				break;
			case FormCreationStep.BBCODE_UPLOAD:
				setFormCreationStep(FormCreationStep.FIELD_CREATION);
				break;
			case FormCreationStep.FIELD_CREATION:
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
						slug: slugify(bbCodeForm.name),
						createdTimestamp: Date.now(),
						updatedTimestamp: Date.now()
					}
				});
				// history.push(`/form/${slugify(bbCodeForm.name)}`);
				history.push(`/forms/list`);
				localStorage.removeItem("newBBCodeForm");
				break;
		}
	};
	const decrementFormCreationStep = (): void => {
		switch (formCreationStep) {
			case FormCreationStep.BBCODE_UPLOAD:
				setFormCreationStep(FormCreationStep.FORM_SETUP);
				break;
			case FormCreationStep.FIELD_CREATION:
				setFormCreationStep(FormCreationStep.BBCODE_UPLOAD);
				break;
			case FormCreationStep.BBCODE_MATCH:
				setFormCreationStep(FormCreationStep.FIELD_CREATION);
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
			saveEdits({ ...bbCodeForm, updatedTimestamp: Date.now() });
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
					<div className="header" style={{ border: 0 }}>
						{formCreationStep !== FormCreationStep.FORM_SETUP && (
							<Button
								variant="secondary"
								onClick={() => decrementFormCreationStep()}>
								Back
							</Button>
						)}
						<h3 style={{ margin: "auto" }}>{formCreationStep}</h3>

						{(formCreationStep !== FormCreationStep.BBCODE_MATCH ||
							!editMode) && (
							<Button
								variant="info"
								onClick={() => incrementFormCreationStep()}
								disabled={
									(formCreationStep === FormCreationStep.FORM_SETUP &&
										bbCodeForm.name === "") ||
									(formCreationStep === FormCreationStep.FIELD_CREATION &&
										(bbCodeForm.inputComponents == null ||
											bbCodeForm.inputComponents.length === 0)) ||
									(formCreationStep === FormCreationStep.BBCODE_UPLOAD &&
										bbCodeForm.rawBBCode === "")
								}>
								{(formCreationStep === FormCreationStep.FORM_SETUP ||
									formCreationStep === FormCreationStep.FIELD_CREATION ||
									formCreationStep === FormCreationStep.BBCODE_UPLOAD) &&
									"Next"}
								{formCreationStep === FormCreationStep.BBCODE_MATCH && "Save"}
							</Button>
						)}
					</div>
					{/* <ProgressBar
						now={
							((formCreationStepEnums.indexOf(formCreationStep) + 1) /
								formCreationStepEnums.length) *
							100
						}
						label={`${formCreationStepEnums.indexOf(formCreationStep) + 1} / 4`}
						variant="info"
						style={{ marginTop: ".5rem" }}
					/> */}
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

			{formCreationStep === FormCreationStep.FIELD_CREATION && (
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
				<Row style={{ marginTop: "3rem", paddingBottom: ".5rem" }}>
					<Col xs={12}>
						<Button
							style={{ float: "left" }}
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
