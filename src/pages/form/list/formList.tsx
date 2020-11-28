import "./formList.css";

import {
	Button,
	ButtonGroup,
	Col,
	Form,
	OverlayTrigger,
	Row,
	Table,
	Tooltip
} from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from "react-sortable-hoc";
import {
	formatDateTimeWithSeconds,
	getFormUid,
	parseBookmarkLink
} from "common/formatters";
import { getFormProgressString, getFormProgressTimestamp } from "common/utils";

import { AuthContext } from "context/authContext";
import { BBCodeForm } from "types/formTypes";
import CopyToClipboard from "react-copy-to-clipboard";
import { DefaultToast } from "components/toast/oldToast";
import Firebase from "components/firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormCreator from "pages/form/creator/formCreator";
import Fuse from "fuse.js";
import { LinkContainer } from "react-router-bootstrap";
import StandardModal from "components/modals/standardModal";
import _ from "lodash";

const DragHandle = SortableHandle(() => (
	<div className="drag-handle">
		<FontAwesomeIcon icon="bars" />
	</div>
));

type SortableFormElementProps = {
	form: BBCodeForm;
	showEditButtons: boolean;
	editForm: () => void;
	deleteForm: () => void;
};

const SortableFormElement = SortableElement(
	({
		form,
		editForm,
		deleteForm,
		showEditButtons
	}: SortableFormElementProps) => {
		const { authUser } = useContext(AuthContext);
		const localStorageFormProgressJson = localStorage.getItem(
			getFormProgressString(form)
		);
		const localStorageFormProgress = localStorageFormProgressJson
			? (JSON.parse(localStorageFormProgressJson) as BBCodeForm)
			: null;
		const formProgressTimestamp =
			localStorageFormProgress && localStorageFormProgress.progressTimestamp
				? formatDateTimeWithSeconds(
						new Date(localStorageFormProgress.progressTimestamp)
				  )
				: null;
		return (
			<tr>
				{showEditButtons && (
					<td>
						<DragHandle />
					</td>
				)}
				<td>{form.name}</td>
				{!showEditButtons && (
					<td>
						<CopyToClipboard
							text={
								process.env.NODE_ENV === "development"
									? `localhost:3000/form/shareable/${authUser?.uid}/${form.uid}`
									: `https://bbcode.rip/form/shareable/${authUser?.uid}/${form.uid}`
							}
							onCopy={() =>
								DefaultToast({ message: `Shareable link copied to clipboard` })
							}>
							<Button variant="dark" onClick={() => null}>
								<FontAwesomeIcon icon="link" fixedWidth></FontAwesomeIcon>
							</Button>
						</CopyToClipboard>
					</td>
				)}
				{!showEditButtons && (
					<td>
						{form.bookmarkLink && (
							<Button
								as="a"
								target="_blank"
								variant="dark"
								href={parseBookmarkLink(form.bookmarkLink)}>
								<FontAwesomeIcon icon="bookmark" fixedWidth></FontAwesomeIcon>
							</Button>
						)}
					</td>
				)}

				<td>
					{formProgressTimestamp && (
						<OverlayTrigger
							placement="auto"
							overlay={(props) => (
								<Tooltip id={`inProgressDateTooltip-${form.name}`} {...props}>
									{formProgressTimestamp}
								</Tooltip>
							)}>
							<FontAwesomeIcon
								icon="circle"
								fixedWidth
								style={{
									color: "var(--success)"
								}}></FontAwesomeIcon>
						</OverlayTrigger>
					)}
				</td>

				{showEditButtons && (
					<>
						<td>
							<Button
								variant="warning"
								onClick={() => editForm()}
								style={{ marginRight: "1rem" }}>
								<FontAwesomeIcon icon="edit" fixedWidth></FontAwesomeIcon>
							</Button>
						</td>
						<td>
							<Button variant="danger" onClick={() => deleteForm()}>
								<FontAwesomeIcon icon="times" fixedWidth></FontAwesomeIcon>
							</Button>
						</td>
					</>
				)}

				{!showEditButtons && (
					<td align="right" style={{ paddingRight: 0 }}>
						<LinkContainer to={`/form/${form.uid}`} exact>
							<Button className="form-element-go-button" variant="primary">
								<FontAwesomeIcon
									icon="arrow-right"
									fixedWidth></FontAwesomeIcon>
							</Button>
						</LinkContainer>
					</td>
				)}
			</tr>
		);
	}
);

type SortableFormsContainerProps = {
	forms: BBCodeForm[];
	showEditButtons: boolean;
	editBBCodeForm: (form: BBCodeForm) => void;
	deleteBBCodeForm: (form: BBCodeForm) => void;
	setPageModal: (pageModal: {
		message: string;
		visible: boolean;
		continueAction: () => void;
	}) => void;
};

const SortableFormContainer = SortableContainer(
	({
		forms,
		setPageModal,
		editBBCodeForm,
		deleteBBCodeForm,
		showEditButtons
	}: SortableFormsContainerProps) => {
		return (
			<Table responsive borderless hover>
				<thead>
					{!showEditButtons && (
						<tr>
							<th>Form</th>
							<th>Share</th>
							<th>Bookmark</th>
							<th>In Progress</th>
							<th></th>
						</tr>
					)}
					{showEditButtons && (
						<tr>
							<th>Order</th>
							<th>Form</th>
							<th>In Progress</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					)}
				</thead>
				<tbody>
					{forms &&
						forms.map((form, index) => {
							return (
								<SortableFormElement
									form={form}
									showEditButtons={showEditButtons}
									key={index}
									index={index}
									editForm={() => {
										setPageModal({
											visible: true,
											continueAction: () => editBBCodeForm(form),
											message: `Editing '${form.name}' will clear out any current values in the form fields. This cannot be undone.`
										});
									}}
									deleteForm={() => {
										setPageModal({
											visible: true,
											continueAction: () => deleteBBCodeForm(form),
											message: `Are you sure you want to permanently delete '${form.name}' from your forms?.`
										});
									}}
								/>
							);
						})}
				</tbody>
			</Table>
		);
	}
);

const FormList = () => {
	const [pageModal, setPageModal] = useState<{
		message: string;
		visible: boolean;
		continueAction: () => void;
	}>();
	const { authUser, stateForms } = useContext(AuthContext);

	const [editMode, setEditMode] = useState(false);
	const [showEditButtons, setShowEditButtons] = useState(false);
	const [forms, setForms] = useState<BBCodeForm[]>(stateForms);
	const [searchText, setSearchText] = useState("");

	const editBBCodeForm = (bbCodeForm: BBCodeForm) => {
		const formProgressString = getFormProgressString(bbCodeForm);
		localStorage.removeItem(formProgressString);
		localStorage.setItem(
			"editBBCodeForm",
			JSON.stringify(stateForms.find((form) => form.uid === bbCodeForm.uid))
		);
		setEditMode(true);
	};
	const saveEdits = (bbCodeForm: BBCodeForm) => {
		localStorage.removeItem("editBBCodeForm");
		if (
			JSON.stringify(bbCodeForm) !==
			JSON.stringify(stateForms.find((form) => form.uid === bbCodeForm.uid))
		) {
			Firebase()
				.saveForm(
					bbCodeForm.uid,
					{ ...bbCodeForm, uid: getFormUid(bbCodeForm.name) },
					authUser?.uid
				)
				.then(() => {
					setEditMode(false);
					setShowEditButtons(false);
				});
		} else {
			setEditMode(false);
			setShowEditButtons(false);
		}
	};

	const deleteBBCodeForm = (bbCodeForm: BBCodeForm) => {
		const formProgressString = `formProgress_${bbCodeForm.uid}`;
		localStorage.removeItem(formProgressString);
		Firebase()
			.deleteUserForm(bbCodeForm.uid)
			.then(() => {
				setShowEditButtons(false);
				DefaultToast({ message: `'${bbCodeForm.name}' deleted.` });
			});
	};

	const handleOnSortStart = ({ node, helper }: any) => {
		node.childNodes.forEach((td: HTMLTableDataCellElement, index: number) => {
			helper.childNodes[index].style.width = `${td.offsetWidth}px`;
		});
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

	const toggleEditFormList = () => {
		if (!showEditButtons) {
			setShowEditButtons(true);
		} else {
			if (!_.isEqual(stateForms, forms)) {
				Firebase()
					.batchUpdateForms(forms, authUser?.uid)
					.then(() => {
						setShowEditButtons(false);
					});
			} else {
				setShowEditButtons(false);
			}
		}
	};

	useEffect(() => {
		if (searchText === "") {
			setForms(stateForms);
		} else {
			setForms((f) =>
				new Fuse(f, { keys: ["name"] })
					.search(searchText)
					.map((result) => result.item)
			);
		}
	}, [searchText, stateForms]);

	return !editMode ? (
		<Row>
			<Col xs={12}>
				<div
					className="header"
					style={{ display: "flex", justifyContent: "space-between" }}>
					<h4>My Forms</h4>
					<ButtonGroup>
						<LinkContainer to={"/forms/new"}>
							<Button variant="secondary">+ Form</Button>
						</LinkContainer>
						{forms.length > 0 && (
							<Button variant="secondary" onClick={() => toggleEditFormList()}>
								<FontAwesomeIcon
									color={!showEditButtons ? "grey" : "#46a989"}
									icon={!showEditButtons ? "lock" : "lock-open"}
								/>
							</Button>
						)}
					</ButtonGroup>
				</div>
			</Col>
			<Col xs={12} style={{ marginTop: "1rem" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "1rem",
						justifyContent: "space-between"
					}}>
					<div
						style={{
							visibility:
								!showEditButtons && (forms.length !== 0 || searchText !== "")
									? "visible"
									: "hidden"
						}}>
						<Form.Control
							type="text"
							value={searchText}
							placeholder="Search"
							onChange={(e) => {
								setSearchText(e.target.value);
							}}></Form.Control>
					</div>
				</div>
				<SortableFormContainer
					forms={_.orderBy(
						forms,
						(form) => getFormProgressTimestamp(form) || "",
						["desc"]
					)}
					useDragHandle
					helperClass="dragging"
					helperContainer={document.getElementsByTagName("tbody")[0]}
					onSortStart={handleOnSortStart}
					onSortEnd={onDragEnd}
					showEditButtons={showEditButtons}
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
