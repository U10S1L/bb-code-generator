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
var slugify = require("slugify");

export enum FormCreationStep {
	FORM_SETUP = "Form Setup",
	INPUT_CREATION = "Input Creation",
	BBCODE_UPLOAD = "BBCode Upload",
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
		oldInputComponent: InputComponentProps,
		newInputComponent: InputComponentProps
	): void => {
		console.log(oldInputComponent);
		console.log(newInputComponent);

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
		var newMatchedBBCode = bbCodeForm.matchedBBCode
			.slice()
			.replace(selectedInputComponentUniqueId, "");
		console.log(newMatchedBBCode);

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
					<h3 className="header">{formCreationStep}</h3>
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
				<FormSetupCreator val={bbCodeForm.name} setVal={updateFormName} />
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
			<div className="row mt-auto">
				{formCreationStep !== FormCreationStep.FORM_SETUP && (
					<Button
						className="btn btn-default col"
						variant="dark"
						onClick={() => decrementFormCreationStep()}>
						Back
					</Button>
				)}
				<Button
					className="btn btn-default col"
					variant="dark"
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
					{formCreationStep === FormCreationStep.FORM_SETUP && "Start"}
					{(formCreationStep === FormCreationStep.INPUT_CREATION ||
						formCreationStep === FormCreationStep.BBCODE_UPLOAD) &&
						"Next"}
					{formCreationStep === FormCreationStep.BBCODE_MATCH && "Save"}
				</Button>
				{editMode && (
					<div>
						<Button onClick={() => saveEditedBBCodeForm()}>Save</Button>
						<Button onClick={() => cancelEditBBCodeForm()}>Cancel</Button>
					</div>
				)}
			</div>
		</Fragment>
	);
};
export default FormCreator;
