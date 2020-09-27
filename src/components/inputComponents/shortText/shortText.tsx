import React, { useRef } from "react";

import { Form } from "react-bootstrap";
import { InputTypeProps } from "types/formTypes";

const ShortText = ({
	uniqueId,
	placeholder,
	readOnly,
	val,
	setVal,
	setInputRef
}: InputTypeProps) => {
	const ref = useRef<HTMLInputElement>(null!);
	return (
		<Form.Control
			id={uniqueId}
			type="text"
			value={val}
			onChange={(e) => {
				setVal && setVal(e.target.value);
				setInputRef && setInputRef(ref);
			}}
			placeholder={placeholder}
			readOnly={readOnly}
			ref={ref}
			onClick={() => setInputRef && setInputRef(ref)}
			onBlur={() => setInputRef && setInputRef(null)}
		/>
	);
};

export default ShortText;
