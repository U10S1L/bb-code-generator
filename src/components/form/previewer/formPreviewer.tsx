import "./formPreviewer.css";

import { Button, Form } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import { InputComponentProps, InputTypeProps } from "types/formTypes";
import React, { useEffect, useState } from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle
} from "react-sortable-hoc";

import { BBCodeFormType } from "types/formTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputComponent from "components/inputComponents/inputComponent";

type SelectedInputComponentProps = {
	inputComponent: InputComponentProps;
	editInputComponent: () => void;
	onUpdateInputs: (inputs: InputTypeProps[]) => void;
	num: number;
};
type SortableSelectedInputComponentsProps = {
	inputComponents: InputComponentProps[];
	editInputComponent: (inputComponent: InputComponentProps) => void;
};
type FormPreviewerProps = {
	bbCodeForm: BBCodeFormType;
	onReorderSelectedInputComponent: (sortObject: {
		oldIndex: number;
		newIndex: number;
	}) => void;
	onEditSelectedInputComponent: (inputComponent: InputComponentProps) => void;
};

const DragHandle = SortableHandle(() => (
	<div className="drag-handle">
		<FontAwesomeIcon icon="bars" />
	</div>
));
const SelectedInputComponent = SortableElement(
	({
		inputComponent,
		editInputComponent,
		onUpdateInputs,
		num
	}: SelectedInputComponentProps) => {
		return (
			<Row className="preview-input-component">
				<Col xs={10}>
					<InputComponent
						{...inputComponent}
						onUpdateInputs={(inputs: InputTypeProps[]) =>
							onUpdateInputs(inputs)
						}
						orderNum={num}
					/>
				</Col>
				<Col xs={1}>
					<Button onClick={editInputComponent} variant="secondary">
						<FontAwesomeIcon icon={"edit"} />
					</Button>
				</Col>
				<Col xs={1}>
					<DragHandle />
				</Col>
			</Row>
		);
	}
);

const SortableSelectedInputComponents = SortableContainer(
	({
		inputComponents,
		editInputComponent
	}: SortableSelectedInputComponentsProps) => {
		const [previewInputComponents, setPreviewInputComponents] = useState(
			inputComponents
		);

		const onUpdatePreviewInputComponent = (
			inputComponentIndex: number,
			inputs: InputTypeProps[]
		) => {
			var newPreviewInputComponents = previewInputComponents.concat();
			newPreviewInputComponents[inputComponentIndex].inputs = inputs;
			setPreviewInputComponents(newPreviewInputComponents);
		};

		useEffect(() => {
			setPreviewInputComponents(inputComponents);
		}, [inputComponents]);
		return (
			<ul style={{ padding: 0 }}>
				{previewInputComponents &&
					previewInputComponents.map((inputComponent, index) => (
						<SelectedInputComponent
							inputComponent={inputComponent}
							index={index}
							key={index}
							num={index + 1}
							editInputComponent={() => editInputComponent(inputComponent)}
							onUpdateInputs={(updatedInputs) =>
								onUpdatePreviewInputComponent(index, updatedInputs)
							}
						/>
					))}
			</ul>
		);
	}
);
const FormPreviewer = ({
	bbCodeForm,
	onReorderSelectedInputComponent,
	onEditSelectedInputComponent
}: FormPreviewerProps) => {
	const [bbCodeFormPreview, setBBCodeFormPreview] = useState(bbCodeForm);
	useEffect(() => {
		var bbCodeFormWithDefaults = {
			...bbCodeForm,
			inputComponents: bbCodeForm.inputComponents.map((inputComponent) => {
				return {
					...inputComponent,
					inputs: inputComponent.inputs.map((input) => {
						return {
							...input,
							val: inputComponent.defaultVal
						};
					})
				};
			})
		};
		setBBCodeFormPreview(bbCodeFormWithDefaults);
	}, [bbCodeForm]);
	return (
		<Form style={{ backgroundColor: "lightgrey", padding: "1rem" }}>
			<h4>{bbCodeFormPreview.name}</h4>
			<SortableSelectedInputComponents
				inputComponents={bbCodeFormPreview.inputComponents}
				onSortEnd={onReorderSelectedInputComponent}
				editInputComponent={onEditSelectedInputComponent}
				useDragHandle
			/>
		</Form>
	);
};

export default FormPreviewer;
