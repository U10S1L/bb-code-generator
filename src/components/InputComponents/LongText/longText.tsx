import { InputTypeProps } from "types/form";
import React from "react";
import TextAreaAutosize from "react-textarea-autosize";

const LongText = ({ placeholder, readOnly, val, setVal }: InputTypeProps) => {
	return (
		<TextAreaAutosize
			readOnly={readOnly}
			value={val}
			onChange={(e) => setVal && setVal(e.target.value)}
			placeholder={placeholder}
			className="form-control"
			minRows={3}
		/>
	);
};

export default LongText;
