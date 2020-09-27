import { Button, Form, InputGroup } from "react-bootstrap";
import { InputComponentProps, InputTypeProps } from "types/formTypes";
import React, { useCallback, useEffect, useState } from "react";

import BBCodeFormatButtons from "components/bbCodeFormatButtons/bbCodeFormatButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputType from "components/inputComponents/inputType";
import { genInputComponentInputUniqueId } from "formatters";

const InputComponent: React.FC<InputComponentProps> = ({
	uniqueId,
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
	const [currInputRef, setCurrInputRef] = useState<React.MutableRefObject<
		HTMLInputElement | HTMLTextAreaElement
	> | null>(null!);

	const addNewInput = (inputTypeItem: InputTypeProps, startIndex: number) => {
		// Make a copy of the current inputComponentInputs
		var currInputComponentInputs = inputs.concat();
		// Insert new inputTypeItem after the item whose "+" button was clicked
		currInputComponentInputs.splice(startIndex + 1, 0, {
			...inputTypeItem,
			val: defaultVal
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
				inputs.map((input, i) =>
					index === i ? { ...input, val: value } : input
				)
			);
	};

	return (
		<Form.Group style={{ marginBottom: "0" }}>
			<Form.Label>
				<span style={{ fontWeight: "bold" }}>
					{orderNum ? `${orderNum}. ${label}` : `${label}`}
				</span>
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
							type={type}
							selectOptions={selectOptions}
							setInputRef={
								type === "shortText" ||
								type === "longText" ||
								type === "url" ||
								type === "listItem"
									? (
											ref: React.MutableRefObject<
												HTMLInputElement | HTMLTextAreaElement
											> | null
									  ) => setCurrInputRef(ref)
									: undefined
							}
							uniqueId={
								inputType.uniqueId ||
								genInputComponentInputUniqueId(uniqueId, i)
							}
						/>
						{currInputRef?.current &&
							currInputRef.current.id === inputType.uniqueId && (
								<BBCodeFormatButtons
									text={inputType.val}
									selectedText={
										currInputRef?.current.selectionStart &&
										currInputRef?.current.selectionEnd
											? inputType.val.substring(
													currInputRef?.current.selectionStart,
													currInputRef?.current.selectionEnd
											  )
											: ""
									}
									cursorPos={currInputRef?.current.selectionStart || 0}
									updateText={(val: string) => updateInput(i, val)}
								/>
							)}
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
