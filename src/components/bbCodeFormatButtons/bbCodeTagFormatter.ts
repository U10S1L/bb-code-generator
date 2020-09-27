import { InputComponentProps } from "types/formTypes";
import React from "react";

type tagTypes = "bold";

type BBCodeTagFormatterProps = {
	selectedText: string;
	tagType: tagTypes;
};
const bbCodeTagFormatter = ({
	tagType,
	selectedText
}: BBCodeTagFormatterProps): string => {
	switch (tagType) {
		case "bold":
			return `[b]${selectedText}[/b]`;
		default:
			return selectedText;
	}
};

export default bbCodeTagFormatter;
