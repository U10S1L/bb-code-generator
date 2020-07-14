import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { InputComponentProps, InputTypeProps } from "../../types/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputType from "../InputComponents/inputType";

const InputComponent: React.FC<InputComponentProps> = ({
	label,
	description,
	type,
	defaultVal,
	multi,
	inputs,
	onUpdateInputs,
	selectOptions,
	orderNum
}) => {
	const addNewInput = (inputTypeItem: InputTypeProps, startIndex: number) => {
		// Make a copy of the current inputComponentInputs
		var currInputComponentInputs = inputs.concat();
		// Insert new inputTypeItem after the item whose "+" button was clicked
		currInputComponentInputs.splice(startIndex + 1, 0, {
			...inputTypeItem,
			val: defaultVal,
			uniqueId: `{<${inputTypeItem.type}>_${
				Math.floor(Math.random() * (9999 - 0)) + 0
			}}`
		});
		// Update the list of components
		onUpdateInputs && onUpdateInputs(currInputComponentInputs);
	};
	const removeInput = (inputType: InputTypeProps) => {
		onUpdateInputs &&
			onUpdateInputs(inputs.filter((input) => input !== inputType));
	};
	const updateInput = (index: number, value: any) => {
		onUpdateInputs &&
			onUpdateInputs(
				inputs.map((inputComponent, i) =>
					index === i ? { ...inputComponent, val: value } : inputComponent
				)
			);
	};

	return (
		<Form.Group style={{ marginBottom: "0" }}>
			<Form.Label>
				{orderNum}. {label}
				<div className="small text-muted">{description}</div>
			</Form.Label>
			{inputs.map((inputType, i) => {
				const canAddInput = multi;
				const canRemoveInput = multi && inputs.length !== 1;

				return (
					<InputGroup key={i}>
						{multi && (
							<InputGroup.Prepend>
								<InputGroup.Text>{`${i + 1}`}</InputGroup.Text>
							</InputGroup.Prepend>
						)}
						<InputType
							{...inputType}
							setVal={(val: any) => updateInput(i, val)}
							selectOptions={selectOptions}
							type={type}
						/>
						<InputGroup.Append hidden={!multi}>
							<Button
								onClick={() => removeInput(inputType)}
								disabled={!canRemoveInput}>
								<FontAwesomeIcon icon="minus" />
							</Button>
							<Button
								onClick={() => addNewInput(inputType, i)}
								disabled={!canAddInput}>
								<FontAwesomeIcon icon="plus" />
							</Button>
						</InputGroup.Append>
					</InputGroup>
				);
			})}
		</Form.Group>
	);
};

export default InputComponent;
