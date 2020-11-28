import { Checkbox } from "components/field/input/checkbox/checkbox";
import { DateTime } from "components/field/input/dateTimeInputs/dateTime/dateTime";
import { Dropdown } from "components/field/input/dropdown/dropdown";
import { Input } from "types/formTypes";
import ListItem from "components/field/input/listItem/ListItem";
import LongText from "components/field/input/longText/longText";
import React from "react";
import ShortText from "components/field/input/shortText/shortText";
import { TDate } from "components/field/input/dateTimeInputs/tDate/tDate";
import { Time } from "components/field/input/dateTimeInputs/time/time";
import { Url } from "components/field/input/url/url";

type InputTypeProps = {
	typeCode: string;
	inputProps: Input;
};
const InputType = ({ typeCode, inputProps }: InputTypeProps) => {
	switch (typeCode) {
		case "shortText":
			return <ShortText {...inputProps} />;
		case "longText":
			return <LongText {...inputProps} />;
		case "dropdown":
			return <Dropdown {...inputProps} />;
		case "checkbox":
			return <Checkbox {...inputProps} />;
		case "dateTime":
			return <DateTime {...inputProps} />;
		case "date":
			return <TDate {...inputProps} />;
		case "time":
			return <Time {...inputProps} />;
		case "url":
			return <Url {...inputProps} />;
		case "listItem":
			return <ListItem {...inputProps} />;
		default:
			return null;
	}
};
export default InputType;
