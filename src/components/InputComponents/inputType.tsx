import { Checkbox } from "components/inputComponents/checkbox/checkbox";
import { Date } from "components/inputComponents/date/date";
import { DateTime } from "components/inputComponents/dateTime/dateTime";
import { Dropdown } from "components/inputComponents/dropdown/dropdown";
import { InputTypeProps } from "types/formTypes";
import ListItem from "components/inputComponents/listItem/ListItem";
import LongText from "components/inputComponents/longText/longText";
import React from "react";
import ShortText from "components/inputComponents/shortText/shortText";
import { Time } from "components/inputComponents/time/time";
import { Url } from "components/inputComponents/url/url";

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
