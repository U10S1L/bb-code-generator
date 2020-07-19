import "./formList.css";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Button, ButtonGroup } from "react-bootstrap";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from "react-sortable-hoc";
import { AppContext, BBCodeFormType } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Types } from "reducers";
import { LinkContainer } from "react-router-bootstrap";
import StandardModal from "components/Modals/standardModal";
import FormCreator from "pages/form/creator/formCreator";
const DragHandle = SortableHandle(() => (
	<div className="drag-handle">
		<FontAwesomeIcon icon="bars" />
	</div>
));

type SortableFormElementProps = {
	form: BBCodeFormType;
	showDragHandle: boolean;
	editForm: () => void;
	deleteForm: () => void;
};
type SortableFormsContainerProps = {
	forms: BBCodeFormType[];
	showDragHandles: boolean;
	editBBCodeForm: (form: BBCodeFormType) => void;
	deleteBBCodeForm: (form: BBCodeFormType) => void;
	setPageModal: (pageModal: {
		message: string;
		visible: boolean;
		continueAction: () => void;
	}) => void;
};
const SortableFormElement = SortableElement(
	({
		form,
		editForm,
		deleteForm,
		showDragHandle
	}: SortableFormElementProps) => {
		return (
			<div className="form-element">
				{showDragHandle && <DragHandle />}
				<Card bg="light" color="white" style={{ borderRadius: 0 }}>
					<Card.Body>
						<Card.Title>{form.name}</Card.Title>
						<ButtonGroup>
							<Button variant="warning" size="sm" onClick={() => editForm()}>
								Edit
							</Button>
							<Button variant="danger" size="sm" onClick={() => deleteForm()}>
								Delete
							</Button>
						</ButtonGroup>
					</Card.Body>
				</Card>
				<LinkContainer to={`/form/${form.slug}`} exact>
					<Button className="form-element-go-button" variant="info">
						<FontAwesomeIcon icon="arrow-right"></FontAwesomeIcon>
					</Button>
				</LinkContainer>
			</div>
		);
	}
);

const SortableFormContainer = SortableContainer(
	({
		forms,
		setPageModal,
		editBBCodeForm,
		deleteBBCodeForm,
		showDragHandles
	}: SortableFormsContainerProps) => {
		return (
			<ul style={{ padding: 0 }}>
				{forms &&
					forms.map((form, index) => (
						<SortableFormElement
							form={form}
							showDragHandle={showDragHandles}
							key={index}
							index={index}
							editForm={() => {
								setPageModal({
									visible: true,
									continueAction: () => editBBCodeForm(form),
									message:
										"Editing the form will erase any values that you've typed in the form fields, which cannot be undone. Do you wish to continue?"
								});
							}}
							deleteForm={() => {
								setPageModal({
									visible: true,
									continueAction: () => deleteBBCodeForm(form),
									message:
										"This will delete the form. You might want to consider exporting it first... do you wish to continue?"
								});
							}}
						/>
					))}
			</ul>
		);
	}
);

const FormList = () => {
	const { state, dispatch } = useContext(AppContext);
	let history = useHistory();
	const [pageModal, setPageModal] = useState<{
		message: string;
		visible: boolean;
		continueAction: () => void;
	}>();
	const [editMode, setEditMode] = useState(false);
	const [isChangingOrder, setIsChangingOrder] = useState(false);

	const getOriginalBBCodeForm = (bbCodeForm: BBCodeFormType) => {
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
	};

	const editBBCodeForm = (bbCodeForm: BBCodeFormType) => {
		const formProgressString = `formProgress_${bbCodeForm.uniqueId}`;
		localStorage.removeItem(formProgressString);
		localStorage.setItem(
			"editBBCodeForm",
			JSON.stringify(getOriginalBBCodeForm(bbCodeForm))
		);
		setEditMode(true);
	};
	const saveEdits = (bbCodeForm: BBCodeFormType) => {
		localStorage.removeItem("editBBCodeForm");
		dispatch({ type: Types.UpdateForm, payload: bbCodeForm });
		setEditMode(false);
	};

	const deleteBBCodeForm = (bbCodeForm: BBCodeFormType) => {
		const formProgressString = `formProgress_${bbCodeForm.uniqueId}`;
		localStorage.removeItem(formProgressString);
		dispatch({ type: Types.DeleteForm, payload: bbCodeForm });
		history.push("/forms/list");
	};
	const reorderForms = (sortObject: { oldIndex: number; newIndex: number }) => {
		dispatch({
			type: Types.UpdateForms,
			payload: arrayMove(state.forms, sortObject.oldIndex, sortObject.newIndex)
		});
	};

	return !editMode ? (
		<Row>
			<Col xs={12}>
				<div className="header">
					<h3>My Forms</h3>
					{state.forms.length > 1 && (
						<Button
							variant={isChangingOrder ? "success" : "secondary"}
							onClick={() => setIsChangingOrder(!isChangingOrder)}>
							{isChangingOrder ? "Save Order" : "Change Order"}
						</Button>
					)}
					<Button
						variant="secondary"
						onClick={() => history.push("/forms/new")}>
						Add Form
					</Button>
				</div>
			</Col>
			<Col xs={12} style={{ marginTop: "1rem" }}>
				<SortableFormContainer
					useDragHandle
					onSortEnd={reorderForms}
					forms={state.forms}
					showDragHandles={isChangingOrder}
					editBBCodeForm={editBBCodeForm}
					deleteBBCodeForm={deleteBBCodeForm}
					setPageModal={setPageModal}
				/>
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

export default FormList;
