import { Button, InputGroup } from "react-bootstrap";
import { Field, Input } from "types/formTypes";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputType from "components/field/inputType";
import StandardModal from "components/modals/standardModal";
import { genInputUniqueId } from "common/utils";

const FieldComponent: React.FC<Field> = ({
	uniqueId,
	fieldType,
	defaultVal,
	multi,
	multiStar,
	inputs,
	selectOptions,
	onUpdateInputs
}) => {
	const [hoveringResetButton, setHoveringResetButton] = useState({
		hovering: false,
		inputUniqueId: ""
	});

	const [resetModalProps, setResetModalProps] = useState({
		visible: false,
		inputIndex: -1
	});

	const addInput = (input: Input, startIndex: number) => {
		// Make a copy of the current inputs
		var currInputs = inputs.concat();
		// Insert new input after the item whose "+" button was clicked
		currInputs.splice(startIndex + 1, 0, {
			...input,
			val: defaultVal
		});
		// Update the list of components
		onUpdateInputs && onUpdateInputs(currInputs);
	};
	const removeInput = (inputType: Input) => {
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
		<div id={uniqueId}>
			{inputs.map((input, i) => {
				const canAddInput = multi || multiStar;
				const canRemoveInput = (multi || multiStar) && inputs.length !== 1;
				return (
					<div key={i}>
						<InputGroup>
							{multiStar && (
								<InputGroup.Prepend>
									<InputGroup.Text>{`[*]`}</InputGroup.Text>
								</InputGroup.Prepend>
							)}
							<InputType
								inputProps={{
									...input,
									onUpdateVal: (val: any) => updateInput(i, val),
									selectOptions: selectOptions,
									uniqueId: input.uniqueId || genInputUniqueId(uniqueId, i)
								}}
								typeCode={fieldType.typeCode}
							/>
							{fieldType.typeCode !== "date" &&
								fieldType.typeCode !== "time" &&
								fieldType.typeCode !== "dateTime" &&
								fieldType.typeCode !== "dropdown" &&
								fieldType.typeCode !== "checkbox" &&
								input.val !== defaultVal && (
									<Button
										variant="link"
										onClick={() =>
											setResetModalProps({ visible: true, inputIndex: i })
										}
										onMouseEnter={() =>
											setHoveringResetButton({
												hovering: true,
												inputUniqueId: input.uniqueId || ""
											})
										}
										onMouseLeave={() =>
											setHoveringResetButton({
												hovering: false,
												inputUniqueId: ""
											})
										}
										style={{
											position: "absolute",
											right: "0",
											zIndex: 3
										}}>
										<FontAwesomeIcon
											icon="undo"
											style={{ pointerEvents: "none" }}
											color={
												hoveringResetButton.hovering &&
												hoveringResetButton.inputUniqueId === input.uniqueId
													? "red"
													: "lightgrey"
											}
										/>
									</Button>
								)}
						</InputGroup>
						{(multi || multiStar) && (
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									float: "right"
								}}>
								<Button
									variant="link"
									size="sm"
									onClick={() => removeInput(input)}
									disabled={!canRemoveInput}>
									<FontAwesomeIcon
										icon="minus"
										color="#bd3f5d"
										style={{ pointerEvents: "none" }}
									/>
								</Button>
								<Button
									variant="link"
									size="sm"
									onClick={() => addInput(input, i)}
									disabled={!canAddInput}>
									<FontAwesomeIcon
										icon="plus"
										color="#46a989"
										style={{ pointerEvents: "none" }}
									/>
								</Button>
							</div>
						)}

						<StandardModal
							visible={
								resetModalProps.visible && i === resetModalProps.inputIndex
							}
							handleClose={() =>
								setResetModalProps({ visible: false, inputIndex: -1 })
							}
							handleContinue={() => {
								updateInput(i, defaultVal);
								setResetModalProps({ visible: false, inputIndex: -1 });
							}}
							title={"Erase this text?"}
							message={`"${input.val}" will be erased from this field. This cannot be done.`}
							closeBtnText={"Cancel"}
							continueBtnText={"Reset"}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default FieldComponent;
