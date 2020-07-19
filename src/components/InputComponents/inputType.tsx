import React from "react";
import ShortText from "./ShortText/shortText";
import LongText from "./LongText/longText";
import { InputTypeProps } from "../../types/form";
import { DateTime } from "./DateTime/dateTime";
import { Dropdown } from "./Dropdown/dropdown";
import { Checkbox } from "./Checkbox/checkbox";
import { Date } from "./Date/date";
import { Time } from "./Time/time";
import { Url } from "./Url/url";
import ListItem from "./ListItem/ListItem";

const InputType = (props: InputTypeProps) => {
	switch (props.type) {
		case "shortText":
			return <ShortText {...props} />;
		case "longText":
			return <LongText {...props} />;
		case "dropdown":
			return <Dropdown {...props} />;
		case "checkbox":
			return <Checkbox {...props} />;
		case "dateTime":
			return <DateTime {...props} />;
		case "date":
			return <Date {...props} />;
		case "time":
			return <Time {...props} />;
		case "url":
			return <Url {...props} />;
		case "listItem":
			return <ListItem {...props} />;
	}
};
export default InputType;
