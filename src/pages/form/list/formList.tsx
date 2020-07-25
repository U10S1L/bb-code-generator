import "./formList.css";

import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from "react-sortable-hoc";
import { deepEqual, deepStrictEqual } from "assert";

import { AppContext } from "context/context";
import { BBCodeFormType } from "types/formTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormCreator from "pages/form/creator/formCreator";
import { LinkContainer } from "react-router-bootstrap";
import StandardModal from "components/modals/standardModal";
import { Types } from "types/contextTypes";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";

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
				<LinkContainer to={`/form/${form.uid}`} exact>
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
	const { state } = useContext(AppContext);
	const [user] = useAuthState(state.firebase.auth);
	const [pageModal, setPageModal] = useState<{
		message: string;
		visible: boolean;
		continueAction: () => void;
	}>();
	const [editMode, setEditMode] = useState(false);

	const [isChangingOrder, setIsChangingOrder] = useState(false);
	const [forms, setForms] = useState<BBCodeFormType[]>(state.forms);

	const editBBCodeForm = (bbCodeForm: BBCodeFormType) => {
		const formProgressString = `formProgress_${bbCodeForm.uid}`;
		localStorage.removeItem(formProgressString);
		localStorage.setItem(
			"editBBCodeForm",
			JSON.stringify(state.forms.find((form) => form.uid === bbCodeForm.uid))
		);
		setEditMode(true);
	};
	const saveEdits = (bbCodeForm: BBCodeFormType) => {
		localStorage.removeItem("editBBCodeForm");
		state.firebase.saveForm(bbCodeForm, user?.uid).then(() => {
			setEditMode(false);
		});
	};

	const deleteBBCodeForm = (bbCodeForm: BBCodeFormType) => {
		const formProgressString = `formProgress_${bbCodeForm.uid}`;
		localStorage.removeItem(formProgressString);
		state.firebase.deleteUserForm(bbCodeForm.uid);
	};

	const onDragEnd = (sortObject: { oldIndex: number; newIndex: number }) => {
		var reorderedForms = arrayMove(
			forms,
			sortObject.oldIndex,
			sortObject.newIndex
		);
		reorderedForms = reorderedForms.map((form, i) => {
			return {
				...form,
				order: i + 1
			};
		});
		setForms(reorderedForms);
	};
	const toggleChangeOrder = () => {
		if (!isChangingOrder) {
			setIsChangingOrder(true);
		} else {
			// Makes call to database if necessary to update to a new order.
			if (state.forms == forms) {
				setIsChangingOrder(false);
			} else {
				state.firebase.batchUpdateForms(forms, user?.uid).then(() => {
					setIsChangingOrder(false);
				});
			}
		}
	};

	useEffect(() => {
		setForms(state.forms);
	}, [state.forms]);

	return !editMode ? (
		<Row>
			<Col xs={12}>
				<div className="header">
					<h3>My Forms</h3>
					{forms.length > 1 && (
						<Button
							variant={isChangingOrder ? "success" : "secondary"}
							onClick={() => toggleChangeOrder()}>
							{isChangingOrder ? "Save Order" : "Change Order"}
						</Button>
					)}
					<LinkContainer to={"/forms/new"}>
						<Button variant="secondary">Add Form</Button>
					</LinkContainer>
				</div>
			</Col>
			<Col xs={12} style={{ marginTop: "1rem" }}>
				<SortableFormContainer
					useDragHandle
					onSortEnd={onDragEnd}
					forms={forms}
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
