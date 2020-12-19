import React, { FormEvent, useCallback, useEffect, useState } from "react";

import { BBCodeForm } from "types/formTypes";
import BBCodeFormatButtons from "components/bbCodeFormatter/bbCodeFormatButtons";
import FieldComponent from "components/field/fieldComponent";
import { Form } from "react-bootstrap";
import { Input } from "types/formTypes";
import { genInputUniqueId } from "common/utils";

type FormRendererProps = {
	bbCodeForm: BBCodeForm;
	onUpdateBBCodeForm: (bbCodeForm: BBCodeForm) => void;
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

	const updateInputs = (fieldIndex: number, inputs: Input[]) => {
		var newFields = bbCodeForm.fields.concat();
		newFields[fieldIndex].inputs = inputs.map((input, i) => {
			return {
				...input,
				uniqueId: genInputUniqueId(newFields[fieldIndex].uniqueId, i)
			};
		});
		const updatedBBCodeForm = {
			...bbCodeForm,
			fields: newFields
		};
		onUpdateBBCodeForm(updatedBBCodeForm);
	};

	const updateInputWithBBCodeFormatting = (inputVal: string) => {
		if (bbCodeFormatInfo.inputRef) {
			const parentField = bbCodeForm.fields.find(
				(field) =>
					field.uniqueId ===
					bbCodeFormatInfo.inputRef?.parentElement?.parentElement?.parentElement
						?.id
			);
			if (parentField) {
				const input = parentField?.inputs.find(
					(input) => (input.uniqueId = bbCodeFormatInfo.inputRef?.id)
				);

				if (input) {
					const prevVal = bbCodeFormatInfo.inputRef?.value;
					updateInputs(
						bbCodeForm.fields.indexOf(parentField),
						parentField.inputs.map((input, i) =>
							i === parentField.inputs.indexOf(input)
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

	const updateInputRef = useCallback(
		(e: MouseEvent | FocusEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				const { target } = e;
				const parentField = bbCodeForm.fields.find(
					(field) =>
						field.uniqueId ===
						target.parentElement?.parentElement?.parentElement?.id
				);

				if (parentField &&
					(parentField.fieldType.typeCode === "shortText" || parentField.fieldType.typeCode === "longText" || parentField.fieldType.typeCode === "listItem")) {
					setBBCodeFormatInfo((prev) => ({ ...prev, inputRef: target }));
				} else {
					setBBCodeFormatInfo((prev) => ({ ...prev, inputRef: null }))
				}
			} else if (!(e.target instanceof HTMLButtonElement) || e.target.parentElement?.id !== "bbCodeFormatButtons") {
				setBBCodeFormatInfo((prev) => ({ ...prev, inputRef: null }))
			}
		},
		[bbCodeForm.fields]
	);


	const updateTextSelection = useCallback((e: Event) => {
		if ((e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) ||
			bbCodeFormatInfo.inputRef !== null) {
			setBBCodeFormatInfo({
				...bbCodeFormatInfo,
				selectionStart: bbCodeFormatInfo.inputRef?.selectionStart || 0,
				selectionEnd: bbCodeFormatInfo.inputRef?.selectionEnd || 0
			});
		}
	},
		[bbCodeFormatInfo, setBBCodeFormatInfo]
	);

	useEffect(() => {
		window.addEventListener("mousedown", updateInputRef);
		window.addEventListener("focusin", updateInputRef);
		window.addEventListener("mouseup", updateTextSelection);
		window.addEventListener("input", updateTextSelection);
		return () => {
			window.removeEventListener("mousedown", updateInputRef);
			window.removeEventListener("focusin", updateInputRef);
			window.removeEventListener("mouseup", updateTextSelection);
			window.removeEventListener("input", updateTextSelection);
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
			{bbCodeForm.fields != null &&
				bbCodeForm.fields.map((field, i) => {
					return (
						<Form.Group key={i} style={{ marginBottom: "1rem" }}>
							<Form.Label>
								<span
									style={{
										fontWeight: "bold"
									}}>{`${field.label}`}</span>
								<div className="small text-muted">{field.description}</div>
							</Form.Label>

							<FieldComponent
								{...field}
								onUpdateInputs={(updatedInputs) =>
									updateInputs(i, updatedInputs)
								}
							/>
							{bbCodeFormatInfo?.inputRef?.id != null &&
								bbCodeFormatInfo?.inputRef?.id.indexOf(field.uniqueId) > -1 && (
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
											bbCodeFormatInfo?.inputRef?.id.indexOf(field.uniqueId) >
											-1
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
