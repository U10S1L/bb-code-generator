import React from "react";
import { BBCodeFormType } from "../../../context";
import InputComponent from "../../InputComponents/inputComponent";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

type FormRendererProps = {
	bbCodeForm: BBCodeFormType;
	onUpdateBBCodeForm: (bbCodeForm: BBCodeFormType) => void;
};

const FormRenderer = ({
	bbCodeForm,
	onUpdateBBCodeForm
}: FormRendererProps) => {
	const onUpdateInputComponentInputs = (
		inputComponentIndex: number,
		inputComponentInputs: InputTypeProps[]
	) => {
		var newInputComponents = bbCodeForm.inputComponents.concat();
		newInputComponents[inputComponentIndex].inputs = inputComponentInputs;
		const updatedBBCodeForm = {
			...bbCodeForm,
			inputComponents: newInputComponents
		};
		onUpdateBBCodeForm(updatedBBCodeForm);
	};

	return (
		<Form>
			{bbCodeForm.inputComponents != null &&
				bbCodeForm.inputComponents.map((inputComponent, i) => {
					return (
						<InputComponent
							{...inputComponent}
							onUpdateInputs={(updatedInputs) =>
								onUpdateInputComponentInputs(i, updatedInputs)
							}
							key={i}
						/>
					);
				})}
		</Form>
	);
};

export default FormRenderer;
