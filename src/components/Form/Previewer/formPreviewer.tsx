import "./formPreviewer.css";
import React, { useState, useEffect } from "react";
import { BBCodeFormType } from "../../../context";
import InputComponent from "../../InputComponents/inputComponent";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputComponentProps, InputTypeProps } from "../../../types/form";
import { Row, Col } from "react-bootstrap";
import {
	SortableContainer,
	SortableElement,
	SortableHandle
} from "react-sortable-hoc";

type SelectedInputComponentProps = {
	inputComponent: InputComponentProps;
	editInputComponent: () => void;
	onUpdateInputComponentInputs: (inputs: InputTypeProps[]) => void;
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
		onUpdateInputComponentInputs,
		num
	}: SelectedInputComponentProps) => {
		return (
			<Row className="preview-input-component">
				<Col xs={10}>
					<InputComponent
						{...inputComponent}
						onUpdateInputs={(inputs: InputTypeProps[]) =>
							onUpdateInputComponentInputs(inputs)
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
			inputComponentInputs: InputTypeProps[]
		) => {
			var newPreviewInputComponents = previewInputComponents.concat();
			newPreviewInputComponents[
				inputComponentIndex
			].inputs = inputComponentInputs;
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
							onUpdateInputComponentInputs={(updatedInputs) =>
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
		<Form>
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
