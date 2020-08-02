import { BBCodeFormType, InputComponentProps } from "types/formTypes";
import { Button, Col, Row } from "react-bootstrap";
import React, { Fragment, useContext, useEffect, useState } from "react";

import { AuthContext } from "context/authContext";
import { ErrorToast } from "components/toast/toast";
import Firebase from "components/firebase/firebase";
import FormBBCodeMatch from "components/bbCode/match/formBBCodeMatch";
import FormBBCodeUpload from "components/bbCode/upload/formBBCodeUpload";
import FormInputCreator from "components/form/creator/input/formInputCreator";
import FormSetupCreator from "components/form/creator/setup/formSetupCreator";
import Help from "components/help/help";
import arrayMove from "array-move";
import { getFormUid } from "formatters";
import { useHistory } from "react-router-dom";

export enum FormCreationStep {
	FORM_SETUP = "Setup",
	BBCODE_UPLOAD = "Raw BBCode",
	FIELD_CREATION = "Field Creation",
	BBCODE_MATCH = "BBCode Match"
}

type FormCreatorProps = {
	editMode: boolean;
	saveEdits: (bbCodeForm: BBCodeFormType) => void;
};

const FormCreator = ({ editMode, saveEdits }: FormCreatorProps) => {
	const { authUser, stateForms } = useContext(AuthContext);
	const [formCreationStep, setFormCreationStep] = useState(
		FormCreationStep.FORM_SETUP
	);

	const [bbCodeForm, setBBCodeForm] = useState<BBCodeFormType>({
		uid: "",
		name: "",
		inputComponents: [],
		rawBBCode: "",
		matchedBBCode: "",
		createdTimestamp: Date.now(),
		updatedTimestamp: Date.now()
	});

	const [originalBBCodeForm, setOriginalBBCodeForm] = useState<BBCodeFormType>({
		uid: "",
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
				return `Setup Demo`;
			case FormCreationStep.BBCODE_UPLOAD:
				return `Raw BBCode Demo`;
			case FormCreationStep.FIELD_CREATION:
				return `Field Creation Demo`;
			case FormCreationStep.BBCODE_MATCH:
				return `BBCode Match Demo`;
			default:
				return ``;
		}
	};

	// TODO: fix this ass 'help' UX
	const getHelpText = () => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				return `<img class="img-fluid" src="https://i.imgur.com/cEtsx5O.gif"/>
				`;
			case FormCreationStep.BBCODE_UPLOAD:
				return `<img class="img-fluid" src="https://i.imgur.com/sdxzJLb.gif"/>
				`;

			case FormCreationStep.FIELD_CREATION:
				return `<img class="img-fluid" src="https://i.imgur.com/yHX1Lv0.gif"/>
				`;
			case FormCreationStep.BBCODE_MATCH:
				return `<img class="img-fluid" src="https://i.imgur.com/KvDUNTl.gif"/>
				`;
			default:
				return ``;
		}
	};

	const history = useHistory();

	// Form Creation Step
	const incrementFormCreationStep = (): void => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				if (doesFormNameExist()) {
					ErrorToast(`You already have a form named "${bbCodeForm.name}".`);
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
				Firebase()
					.saveForm(
						null,
						{
							...bbCodeForm,
							uid: getFormUid(bbCodeForm.name),
							createdTimestamp: Date.now(),
							updatedTimestamp: Date.now(),
							order: stateForms.length + 1
						},
						authUser?.uid
					)
					.then(() => {
						history.replace(`/forms/list`);
						localStorage.removeItem("newBBCodeForm");
					})
					.catch((error) => {});
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
			return (
				stateForms.find((form) => form.uid === getFormUid(bbCodeForm.name)) !=
				null
			);
		} else {
			return (
				stateForms.find(
					(form) =>
						form.uid !== getFormUid(originalBBCodeForm.name) &&
						form.uid === getFormUid(bbCodeForm.name)
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
						<h3 style={{ margin: "auto" }}>{formCreationStep}</h3>

						{editMode && (
							<Row>
								<Col
									xs={12}
									style={{ display: "flex", justifyContent: "flex-end" }}>
									<Button
										variant="success"
										onClick={() => saveEditedBBCodeForm()}>
										Save Edits
									</Button>
									<Button
										style={{ float: "right", marginLeft: "1.5rem" }}
										variant="danger"
										onClick={() => cancelEditBBCodeForm()}>
										Discard Edits
									</Button>
								</Col>
							</Row>
						)}
					</div>
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
			<Row style={{ marginTop: "2rem", paddingBottom: "1rem" }}>
				<Col xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
					{formCreationStep !== FormCreationStep.FORM_SETUP && (
						<Button
							variant="secondary"
							onClick={() => decrementFormCreationStep()}>
							Back
						</Button>
					)}

					{(formCreationStep !== FormCreationStep.BBCODE_MATCH ||
						!editMode) && (
						<Button
							variant="info"
							style={{ marginLeft: "1.5rem" }}
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
				</Col>
			</Row>
			<Help title={getHelpTitle()} text={getHelpText()}></Help>
		</Fragment>
	);
};
export default FormCreator;
