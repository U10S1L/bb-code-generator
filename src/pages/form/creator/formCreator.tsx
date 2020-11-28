import { BBCodeForm, Field } from "types/formTypes";
import { Button, Col, Row } from "react-bootstrap";
import React, { Fragment, useContext, useEffect, useState } from "react";

import { AuthContext } from "context/authContext";
import { DefaultToast } from "components/toast/oldToast";
import Firebase from "components/firebase/firebase";
import FormBBCodeMatch from "components/form/creator/bbCode/match/formBBCodeMatch";
import FormBBCodeUpload from "components/form/creator/bbCode/upload/formBBCodeUpload";
import FormFieldCreator from "components/form/creator/field/formFieldCreator";
import FormSetupCreator from "components/form/creator/setup/formSetupCreator";
import Help from "components/help/help";
import arrayMove from "array-move";
import { getFormUid } from "common/formatters";
import { useHistory } from "react-router-dom";

enum FormCreationStep {
	FORM_SETUP = "Setup",
	BBCODE_UPLOAD = "Raw BBCode",
	FIELD_CREATION = "Field Creation",
	BBCODE_MATCH = "BBCode Match"
}

type FormCreatorProps = {
	editMode: boolean;
	saveEdits: (bbCodeForm: BBCodeForm) => void;
};

const FormCreator = ({ editMode, saveEdits }: FormCreatorProps) => {
	const { authUser, stateForms } = useContext(AuthContext);
	const [formCreationStep, setFormCreationStep] = useState(
		FormCreationStep.FORM_SETUP
	);

	const [bbCodeForm, setBBCodeForm] = useState<BBCodeForm>({
		uid: "",
		name: "",
		fields: [],
		rawBBCode: "",
		matchedBBCode: "",
		bookmarkLink: "",
		createdTimestamp: Date.now(),
		updatedTimestamp: Date.now()
	});

	const [originalBBCodeForm, setOriginalBBCodeForm] = useState<BBCodeForm>({
		uid: "",
		name: "",
		fields: [],
		rawBBCode: "",
		matchedBBCode: "",
		bookmarkLink: "",
		createdTimestamp: Date.now(),
		updatedTimestamp: Date.now()
	});

	const getHelpTitle = () => {
		switch (formCreationStep) {
			case FormCreationStep.FORM_SETUP:
				return `Demo: Setup`;
			case FormCreationStep.BBCODE_UPLOAD:
				return `Demo: Raw BBCode`;
			case FormCreationStep.FIELD_CREATION:
				return `Demo: Field Creation`;
			case FormCreationStep.BBCODE_MATCH:
				return `Demo: BBCode Match`;
			default:
				return ``;
		}
	};

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
					DefaultToast({
						message: `You already have a form named "${bbCodeForm.name}".`,
						type: "error"
					});
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

	// Form Setup
	const updateFormSetup = (setupFields: {
		name: string;
		bookmarkLink: string;
	}) => {
		setBBCodeForm({
			...bbCodeForm,
			name: setupFields.name,
			bookmarkLink: setupFields.bookmarkLink
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

	// Form Fields
	const addField = (field: Field): void => {
		if (bbCodeForm.fields == null) {
			setBBCodeForm({
				...bbCodeForm,
				fields: [field]
			});
		} else {
			setBBCodeForm({
				...bbCodeForm,
				fields: bbCodeForm.fields.concat(field)
			});
		}
	};

	const updateField = (field: Field): void => {
		setBBCodeForm({
			...bbCodeForm,
			fields: bbCodeForm.fields.map((currField) =>
				currField.uniqueId === field.uniqueId ? field : currField
			)
		});
	};

	const removeField = (fieldUniqueId: string) => {
		var regexpFieldUniqueId = new RegExp(fieldUniqueId, "g");
		var newMatchedBBCode = bbCodeForm.matchedBBCode
			.slice()
			.replace(regexpFieldUniqueId, "");

		setBBCodeForm({
			...bbCodeForm,
			matchedBBCode: newMatchedBBCode,
			fields: bbCodeForm.fields.filter(
				(selectedInput) => selectedInput.uniqueId !== fieldUniqueId
			)
		});
	};

	const reorderField = (sortObject: { oldIndex: number; newIndex: number }) => {
		setBBCodeForm({
			...bbCodeForm,
			fields: arrayMove(
				bbCodeForm.fields,
				sortObject.oldIndex,
				sortObject.newIndex
			)
		});
	};

	const saveForm = () => {
		if (doesFormNameExist()) {
			DefaultToast({ message: "Form name already exists.", type: "error" });
		} else {
			saveEdits({ ...bbCodeForm, updatedTimestamp: Date.now() });
		}
	};

	const cancelEditForm = () => {
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
						<h4>{formCreationStep}</h4>
						{editMode && (
							<Row>
								<Col
									xs={12}
									style={{ display: "flex", justifyContent: "flex-end" }}>
									<Button variant="success" onClick={() => saveForm()}>
										Save Edits
									</Button>
									<Button
										style={{ float: "right", marginLeft: "1.5rem" }}
										variant="danger"
										onClick={() => cancelEditForm()}>
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
					setupFields={{
						name: bbCodeForm.name,
						bookmarkLink: bbCodeForm.bookmarkLink
					}}
					updateSetupFields={updateFormSetup}
					showVideoPreview={stateForms.length < 1}
				/>
			)}

			{formCreationStep === FormCreationStep.FIELD_CREATION && (
				<FormFieldCreator
					newBBCodeForm={bbCodeForm}
					addField={addField}
					updateField={updateField}
					removeField={removeField}
					reorderField={reorderField}
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
					selectedFields={bbCodeForm.fields}
					matchedBBCode={bbCodeForm.matchedBBCode}
					setMatchedBBCode={updateMatchedBBCode}
				/>
			)}
			<Row style={{ marginTop: "2rem", paddingBottom: "1rem" }}>
				<Col xs={2} style={{ display: "flex", justifyContent: "flex-start" }}>
					<Help title={getHelpTitle()} text={getHelpText()}></Help>
				</Col>
				<Col xs={10} style={{ display: "flex", justifyContent: "flex-end" }}>
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
							variant="primary"
							style={{ marginLeft: "1.5rem" }}
							onClick={() => incrementFormCreationStep()}
							disabled={
								(formCreationStep === FormCreationStep.FORM_SETUP &&
									bbCodeForm.name === "") ||
								(formCreationStep === FormCreationStep.FIELD_CREATION &&
									(bbCodeForm.fields == null ||
										bbCodeForm.fields.length === 0)) ||
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
		</Fragment>
	);
};
export default FormCreator;
