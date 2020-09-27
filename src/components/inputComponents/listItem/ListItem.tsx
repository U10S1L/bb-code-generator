import React, { useRef } from "react";

import { InputTypeProps } from "types/formTypes";
import TextAreaAutosize from "react-textarea-autosize";

const ListItem = ({
	uniqueId,
	placeholder,
	readOnly,
	val,
	setVal,
	setInputRef
}: InputTypeProps) => {
	const ref = useRef<HTMLTextAreaElement>(null!);
	return (
		<TextAreaAutosize
			id={uniqueId}
			ref={ref}
			onClick={() => setInputRef && setInputRef(ref)}
			onBlur={() => setInputRef && setInputRef(null)}
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
