import React, { useEffect } from "react";

import { BBCodeFormType } from "types/formTypes";
import { Form } from "react-bootstrap";
import InputComponent from "components/inputComponents/inputComponent";
import { InputTypeProps } from "types/formTypes";
import { genInputComponentInputUniqueId } from "formatters";

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
		newInputComponents[inputComponentIndex].inputs = inputComponentInputs.map(
			(input) => {
				return {
					...input,
					uniqueId: genInputComponentInputUniqueId(
						newInputComponents[inputComponentIndex].uniqueId,
						newInputComponents[inputComponentIndex].inputs.indexOf(input)
					)
				};
			}
		);
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
