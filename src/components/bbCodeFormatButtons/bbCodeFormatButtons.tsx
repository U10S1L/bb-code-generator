import { Button } from "react-bootstrap";
import React from "react";
import bbCodeTagFormatter from "components/bbCodeFormatButtons/bbCodeTagFormatter";

type BBCodeFormatButtonsProps = {
	text: string;
	cursorPos: number;
	selectedText: string;
	updateText: (text: string) => void;
};

const BBCodeFormatButtons = ({
	text,
	cursorPos,
	selectedText,
	updateText
}: BBCodeFormatButtonsProps) => {
	return (
		<div>
			<Button
				onClick={() => bbCodeTagFormatter({ tagType: "bold", selectedText })}>
				Bold
			</Button>
		</div>
	);
};

export default BBCodeFormatButtons;
