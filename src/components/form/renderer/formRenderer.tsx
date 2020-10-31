import React, { FormEvent, useCallback, useEffect, useState } from "react";

import { BBCodeFormType } from "types/formTypes";
import BBCodeFormatButtons from "components/bbCodeFormatter/bbCodeFormatButtons";
import { Form } from "react-bootstrap";
import InputComponent from "components/inputComponents/inputComponent";
import { InputTypeProps } from "types/formTypes";
import { genInputUniqueId } from "formatters";

type FormRendererProps = {
	bbCodeForm: BBCodeFormType;
	onUpdateBBCodeForm: (bbCodeForm: BBCodeFormType) => void;
};

const FormRenderer = ({
	bbCodeForm,
	onUpdateBBCodeForm
}: FormRendererProps) => {
	const [bbCodeFormatInfo, setBBCodeFormatInfo] = useState<{
		inputRef: HTMLInputElement | HTMLTextAreaElement | null;
		formatCursorPos: number | null;
		selectionStart: number;
		selectionEnd: number;
	}>({
		inputRef: null!,
		formatCursorPos: null,
		selectionStart: 0,
		selectionEnd: 0
	});

	const updateInputs = (
		inputComponentIndex: number,
		inputs: InputTypeProps[]
	) => {
		var newInputComponents = bbCodeForm.inputComponents.concat();
		newInputComponents[inputComponentIndex].inputs = inputs.map((input, i) => {
			return {
				...input,
				uniqueId: genInputUniqueId(
					newInputComponents[inputComponentIndex].uniqueId,
					i
				)
			};
		});
		const updatedBBCodeForm = {
			...bbCodeForm,
			inputComponents: newInputComponents
		};
		onUpdateBBCodeForm(updatedBBCodeForm);
	};

	const updateInputWithBBCodeFormatting = (inputVal: string) => {
		if (bbCodeFormatInfo.inputRef) {
			const parentInputComponent = bbCodeForm.inputComponents.find(
				(inputComponent) =>
					inputComponent.uniqueId ===
					bbCodeFormatInfo.inputRef?.parentElement?.parentElement?.parentElement
						?.id
			);
			if (parentInputComponent) {
				const input = parentInputComponent?.inputs.find(
					(input) => (input.uniqueId = bbCodeFormatInfo.inputRef?.id)
				);

				if (input) {
					const prevVal = bbCodeFormatInfo.inputRef?.value;
					updateInputs(
						bbCodeForm.inputComponents.indexOf(parentInputComponent),
						parentInputComponent.inputs.map((input, i) =>
							i === parentInputComponent.inputs.indexOf(input)
								? { ...input, val: inputVal }
								: input
						)
					);

					// ctrl+z support for programatically inserted BBCode Formatting Tags (not supported in Firefox)
					bbCodeFormatInfo.inputRef.focus();
					bbCodeFormatInfo.inputRef.value = prevVal;
					bbCodeFormatInfo.inputRef.setSelectionRange(0, prevVal.length);
					document.execCommand("insertText", false, inputVal);
				}
			}
		}
	};

	const updateTextSelection = useCallback(() => {
		setBBCodeFormatInfo({
			...bbCodeFormatInfo,
			selectionStart: bbCodeFormatInfo.inputRef?.selectionStart || 0,
			selectionEnd: bbCodeFormatInfo.inputRef?.selectionEnd || 0
		});
	}, [bbCodeFormatInfo, setBBCodeFormatInfo]);

	const updateInputRef = useCallback(
		(e: MouseEvent | FocusEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				const target = e.target;
				const parentInputComponent = bbCodeForm.inputComponents.find(
					(inputComponent) =>
						inputComponent.uniqueId ===
						target.parentElement?.parentElement?.parentElement?.id
				);
				if (
					parentInputComponent &&
					(parentInputComponent.type === "shortText" ||
						parentInputComponent.type === "longText" ||
						parentInputComponent.type === "listItem")
				) {
					setBBCodeFormatInfo((prev) => ({ ...prev, inputRef: target }));
				} else {
					setBBCodeFormatInfo((prev) => ({
						...prev,
						inputRef: null
					}));
				}
			} else if (
				!(e.target instanceof HTMLButtonElement) ||
				e.target.parentElement?.id !== "bbCodeFormatButtons"
			) {
				setBBCodeFormatInfo((prev) => ({ ...prev, inputRef: null }));
			}
		},
		[bbCodeForm.inputComponents]
	);

	useEffect(() => {
		window.addEventListener("mouseup", updateTextSelection);
		window.addEventListener("focusin", updateInputRef);
		window.addEventListener("mousedown", updateInputRef);
		return () => {
			window.removeEventListener("mouseup", updateTextSelection);
			window.removeEventListener("focusin", updateInputRef);
			window.removeEventListener("mousedown", updateInputRef);
		};
	}, [updateTextSelection, updateInputRef]);

	useEffect(() => {
		// Set cursor position in the text box
		if (bbCodeFormatInfo.formatCursorPos !== null) {
			bbCodeFormatInfo.inputRef?.focus();
			bbCodeFormatInfo.inputRef?.setSelectionRange(
				bbCodeFormatInfo.formatCursorPos,
				bbCodeFormatInfo.formatCursorPos
			);
			setBBCodeFormatInfo((prevBBCodeFormatInfo) => ({
				...prevBBCodeFormatInfo,
				formatCursorPos: null
			}));
		}
	}, [bbCodeFormatInfo.formatCursorPos, bbCodeFormatInfo.inputRef]);

	return (
		<Form onSubmit={(e: FormEvent) => e.preventDefault()}>
			{bbCodeForm.inputComponents != null &&
				bbCodeForm.inputComponents.map((inputComponent, i) => {
					return (
						<Form.Group key={i} style={{ marginBottom: "1rem" }}>
							<Form.Label>
								<span
									style={{
										fontWeight: "bold"
									}}>{`${inputComponent.label}`}</span>
								<div className="small text-muted">
									{inputComponent.description}
								</div>
							</Form.Label>

							<InputComponent
								{...inputComponent}
								onUpdateInputs={(updatedInputs) =>
									updateInputs(i, updatedInputs)
								}
							/>
							{bbCodeFormatInfo?.inputRef?.id != null &&
								bbCodeFormatInfo?.inputRef?.id.indexOf(
									inputComponent.uniqueId
								) > -1 && (
									<BBCodeFormatButtons
										text={bbCodeFormatInfo.inputRef?.value || ""}
										selectionStart={bbCodeFormatInfo.selectionStart}
										selectionEnd={bbCodeFormatInfo.selectionEnd}
										updateText={(text: string, formatCursorPos: number) => {
											updateInputWithBBCodeFormatting(text);
											setBBCodeFormatInfo({
												...bbCodeFormatInfo,
												formatCursorPos
											});
										}}
										visible={
											bbCodeFormatInfo?.inputRef?.id != null &&
											bbCodeFormatInfo?.inputRef?.id.indexOf(
												inputComponent.uniqueId
											) > -1
										}
									/>
								)}
						</Form.Group>
					);
				})}
		</Form>
	);
};

export default FormRenderer;
