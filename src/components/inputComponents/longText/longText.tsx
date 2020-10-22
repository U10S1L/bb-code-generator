import { InputTypeProps } from "types/formTypes";
import React from "react";
import TextAreaAutosize from "react-textarea-autosize";

const LongText = ({
	uniqueId,
	placeholder,
	readOnly,
	val,
	onUpdateVal
}: InputTypeProps) => {
	return (
		<TextAreaAutosize
			id={uniqueId}
			readOnly={readOnly}
			value={val}
			onChange={(e) => {
				onUpdateVal && onUpdateVal(e.target.value);
			}}
			placeholder={placeholder}
			className="form-control"
			minRows={3}
			autoComplete="off"
		/>
	);
};

export default LongText;
