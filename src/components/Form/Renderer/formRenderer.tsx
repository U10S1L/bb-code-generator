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
						<div style={{ marginBottom: "1rem" }} key={i}>
							<InputComponent
								{...inputComponent}
								onUpdateInputs={(updatedInputs) =>
									onUpdateInputComponentInputs(i, updatedInputs)
								}
								orderNum={i + 1}
							/>
						</div>
					);
				})}
		</Form>
	);
};

export default FormRenderer;
