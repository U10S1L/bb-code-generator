import "./formList.css";
import React, { useContext } from "react";
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
};
const SortableFormElement = SortableElement(
	({ form }: SortableFormElementProps) => {
		return (
			<div className="form-element">
				<Card>
					<Card.Body>
						<Card.Title>
							<div>{form.name}</div>
						</Card.Title>
						<DragHandle />
					</Card.Body>
				</Card>
				<LinkContainer to={`/form/${form.slug}`} exact>
					<Button className="form-element-go-button">
						<FontAwesomeIcon icon="arrow-right"></FontAwesomeIcon>
					</Button>
				</LinkContainer>
			</div>
		);
	}
);

type SortableFormsContainerProps = {
	forms: BBCodeFormType[];
};
const SortableFormContainer = SortableContainer(
	({ forms }: SortableFormsContainerProps) => {
		return (
			<ul>
				{forms &&
					forms.map((form, index) => (
						<SortableFormElement form={form} key={index} index={index} />
					))}
			</ul>
		);
	}
);

const FormList = () => {
	const { state, dispatch } = useContext(AppContext);

	const reorderForms = (sortObject: { oldIndex: number; newIndex: number }) => {
		dispatch({
			type: Types.UpdateForms,
			payload: arrayMove(state.forms, sortObject.oldIndex, sortObject.newIndex)
		});
	};

	return (
		<div className="component-wrapper flex-grow-1">
			<Row className="flex-grow-1">
				<Col xs={12}>
					<h3 className="header">Forms</h3>
				</Col>
				<Col xs={12}>
					<SortableFormContainer
						useDragHandle
						onSortEnd={reorderForms}
						forms={state.forms}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default FormList;
