import React from "react";
import ShortText from "./ShortText/shortText";
import LongText from "./LongText/longText";
import Number from "./Number/number";
import { InputTypeProps } from "../../types/form";
import { DateTime } from "./DateTime/dateTime";
import { Dropdown } from "./Dropdown/dropdown";

const InputType = (props: InputTypeProps) => {
	switch (props.type) {
		case "shortText":
			return <ShortText {...props} />;
		case "longText":
			return <LongText {...props} />;
		case "number":
			return <Number {...props} />;
		case "dateTime":
			return <DateTime {...props} />;
		case "dropdown":
			return <Dropdown {...props} />;
	}
};
export default InputType;
