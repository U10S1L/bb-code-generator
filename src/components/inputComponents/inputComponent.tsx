import { Button, Form, InputGroup } from "react-bootstrap";
import { InputComponentProps, InputTypeProps } from "types/formTypes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputType from "components/inputComponents/inputType";
import React from "react";

const InputComponent: React.FC<InputComponentProps> = ({
	label,
	description,
	type,
	defaultVal,
	multi,
	multiStar,
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
				{orderNum ? `${orderNum}. ${label}` : `${label}`}
				<div className="small text-muted">{description}</div>
			</Form.Label>
			{inputs.map((inputType, i) => {
				const canAddInput = multi || multiStar;
				const canRemoveInput = (multi || multiStar) && inputs.length !== 1;

				return (
					<InputGroup key={i}>
						{multiStar && (
							<InputGroup.Prepend>
								<InputGroup.Text>{`[*]`}</InputGroup.Text>
							</InputGroup.Prepend>
						)}
						<InputType
							{...inputType}
							setVal={(val: any) => updateInput(i, val)}
							selectOptions={selectOptions}
							type={type}
						/>
						<InputGroup.Append hidden={!multi && !multiStar}>
							<Button
								variant="outline-danger"
								style={{ margin: "0 .2rem" }}
								onClick={() => removeInput(inputType)}
								disabled={!canRemoveInput}>
								<FontAwesomeIcon icon="minus" />
							</Button>
							<Button
								variant="outline-success"
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
