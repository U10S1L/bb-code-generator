import "./formPreviewer.css";

import { Button, Form } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import { Field, Input } from "types/formTypes";
import React, { useEffect, useState } from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle
} from "react-sortable-hoc";

import { BBCodeForm } from "types/formTypes";
import FieldComponent from "components/field/fieldComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FieldPreviewProps = {
	field: Field;
	num: number;
	editField: () => void;
	onUpdateInputs: (inputs: Input[]) => void;
};
type SortableSelectedFieldsProps = {
	fields: Field[];
	editField: (field: Field) => void;
};
type FormPreviewerProps = {
	bbCodeForm: BBCodeForm;
	onReorderSelectedField: (sortObject: {
		oldIndex: number;
		newIndex: number;
	}) => void;
	onEditSelectedField: (field: Field) => void;
};

const DragHandle = SortableHandle(() => (
	<div className="drag-handle">
		<FontAwesomeIcon style={{ color: "var(--secondary)" }} icon="bars" />
	</div>
));
const FieldPreview = SortableElement(
	({ field, editField, onUpdateInputs, num }: FieldPreviewProps) => {
		return (
			<Row className="preview-input-component">
				<Col xs={10}>
					<Form.Group>
						<Form.Label>
							<span
								style={{
									fontWeight: "bold"
								}}>{`${field.label}`}</span>
							<div className="small text-muted">{field.description}</div>
						</Form.Label>
						<FieldComponent
							{...field}
							onUpdateInputs={(inputs: Input[]) => onUpdateInputs(inputs)}
							orderNum={num}
						/>
					</Form.Group>
				</Col>
				<Col xs={1}>
					<Button onClick={editField} variant="link">
						<FontAwesomeIcon
							icon={"edit"}
							style={{ color: "var(--warning)" }}
						/>
					</Button>
				</Col>
				<Col xs={1}>
					<DragHandle />
				</Col>
			</Row>
		);
	}
);

const SortableSelectedFields = SortableContainer(
	({ fields, editField }: SortableSelectedFieldsProps) => {
		const [previewFields, setPreviewFields] = useState(fields);

		const onUpdatePreviewField = (fieldIndex: number, inputs: Input[]) => {
			var newPreviewFields = previewFields.concat();
			newPreviewFields[fieldIndex].inputs = inputs;
			setPreviewFields(newPreviewFields);
		};

		useEffect(() => {
			setPreviewFields(fields);
		}, [fields]);
		return (
			<ul style={{ padding: 0 }}>
				{previewFields &&
					previewFields.map((field, index) => (
						<FieldPreview
							field={field}
							index={index}
							key={index}
							num={index + 1}
							editField={() => editField(field)}
							onUpdateInputs={(updatedInputs) =>
								onUpdatePreviewField(index, updatedInputs)
							}
						/>
					))}
			</ul>
		);
	}
);

const FormPreviewer = ({
	bbCodeForm,
	onReorderSelectedField,
	onEditSelectedField
}: FormPreviewerProps) => {
	const [bbCodeFormPreview, setBBCodeFormPreview] = useState(bbCodeForm);
	useEffect(() => {
		var bbCodeFormWithDefaults = {
			...bbCodeForm,
			fields: bbCodeForm.fields.map((field) => {
				return {
					...field,
					inputs: field.inputs.map((input) => {
						return {
							...input,
							val: field.defaultVal
						};
					})
				};
			})
		};
		setBBCodeFormPreview(bbCodeFormWithDefaults);
	}, [bbCodeForm]);
	return (
		<Form>
			<h5 className="header">{bbCodeFormPreview.name}</h5>
			<SortableSelectedFields
				fields={bbCodeFormPreview.fields}
				onSortEnd={onReorderSelectedField}
				editField={onEditSelectedField}
				useDragHandle
			/>
		</Form>
	);
};

export default FormPreviewer;
