import { InputTypeProps } from "types/formTypes";
import React from "react";
import TextAreaAutosize from "react-textarea-autosize";

const ListItem = ({ placeholder, readOnly, val, setVal }: InputTypeProps) => {
	return (
		<TextAreaAutosize
			readOnly={readOnly}
			value={val}
			onChange={(e) => setVal && setVal(e.target.value)}
			placeholder={placeholder}
			className="form-control"
			minRows={1}
		/>
	);
};

export default ListItem;
