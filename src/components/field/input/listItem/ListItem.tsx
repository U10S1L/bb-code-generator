import { Input } from "types/formTypes";
import React from "react";
import TextAreaAutosize from "react-textarea-autosize";

const ListItem = ({
	uniqueId,
	placeholder,
	readOnly,
	val,
	onUpdateVal
}: Input) => {
	return (
		<TextAreaAutosize
			id={uniqueId}
			readOnly={readOnly}
			value={val}
			onChange={(e) => onUpdateVal && onUpdateVal(e.target.value)}
			placeholder={placeholder}
			className="form-control"
			minRows={1}
			style={{ paddingRight: "2.5rem" }}
		/>
	);
};

export default ListItem;
