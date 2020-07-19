import "./formList.css";
import React, { useContext, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from "react-sortable-hoc";
import { AppContext, BBCodeFormType } from "../../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Types } from "../../../reducers";
import { LinkContainer } from "react-router-bootstrap";

const DragHandle = SortableHandle(() => (
	<div className="drag-handle">
		<FontAwesomeIcon icon="bars" />
	</div>
));

type SortableFormElementProps = {
	form: BBCodeFormType;
	showDragHandle: boolean;
};
type SortableFormsContainerProps = {
	forms: BBCodeFormType[];
	showDragHandles: boolean;
};
const SortableFormElement = SortableElement(
	({ form, showDragHandle }: SortableFormElementProps) => {
		return (
			<div className="form-element">
				{showDragHandle && <DragHandle />}
				<Card bg="light" color="white" style={{ borderRadius: 0 }}>
					<Card.Body>
						<Card.Title>{form.name}</Card.Title>
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
	({ forms, showDragHandles }: SortableFormsContainerProps) => {
		return (
			<ul style={{ padding: 0 }}>
				{forms &&
					forms.map((form, index) => (
						<SortableFormElement
							form={form}
							showDragHandle={showDragHandles}
							key={index}
							index={index}
						/>
					))}
			</ul>
		);
	}
);

const FormList = () => {
	const { state, dispatch } = useContext(AppContext);
	const [isChangingOrder, setIsChangingOrder] = useState(false);

	const reorderForms = (sortObject: { oldIndex: number; newIndex: number }) => {
		dispatch({
			type: Types.UpdateForms,
			payload: arrayMove(state.forms, sortObject.oldIndex, sortObject.newIndex)
		});
	};

	return (
		<Row>
			<Col xs={12}>
				<div className="header">
					<h3>My Forms</h3>
					<Button
						variant={isChangingOrder ? "success" : "secondary"}
						onClick={() => setIsChangingOrder(!isChangingOrder)}>
						{isChangingOrder ? "Save Order" : "Change Order"}
					</Button>
				</div>
			</Col>
			<Col xs={12} style={{ marginTop: "1rem" }}>
				<SortableFormContainer
					useDragHandle
					onSortEnd={reorderForms}
					forms={state.forms}
					showDragHandles={isChangingOrder}
				/>
			</Col>
		</Row>
	);
};

export default FormList;
