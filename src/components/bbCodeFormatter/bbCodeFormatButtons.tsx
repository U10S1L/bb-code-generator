import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import bbCodeTagFormatter from "components/bbCodeFormatter/bbCodeTagFormatter";

type BBCodeFormatButtonsProps = {
	text: string;
	selectionStart: number;
	selectionEnd: number;
	updateText: (text: string, cursorPos: number) => void;
	visible: boolean;
};

const buttons = [
	{ tagType: "bold", icon: "bold" as IconProp, tooltip: `[b]` },
	{ tagType: "italic", icon: "italic" as IconProp, tooltip: `[i]` },
	{ tagType: "underline", icon: "underline" as IconProp, tooltip: `[u]` },
	{ tagType: "image", icon: "image" as IconProp, tooltip: `[img]` },
	{ tagType: "url", icon: "link" as IconProp, tooltip: `[url=]` },
	{
		tagType: "spoiler",
		icon: "eye-slash" as IconProp,
		tooltip: `[spoiler]`
	},
	{
		tagType: "altspoiler",
		icon: ["far", "envelope"] as IconProp,
		tooltip: `[altspoiler=]`
	},
	{
		tagType: "altspoiler2",
		icon: ["fas", "envelope"] as IconProp,
		tooltip: `[altspoiler2=]`
	}
];

const BBCodeFormatButtons = ({
	text,
	selectionStart,
	selectionEnd,
	updateText
}: BBCodeFormatButtonsProps) => {
	return (
		<div
			id={"bbCodeFormatButtons"}
			style={{
				display: "flex",
				zIndex: 4,
				marginTop: "0.2rem",
				transition: "opacity .1s"
			}}>
			{buttons.map((button, i) => (
				<OverlayTrigger
					key={i}
					placement="auto"
					delay={{ show: 525, hide: 100 }}
					overlay={(props) => (
						<Tooltip
							id={`bbCodeFormatButton-tooltip-${button.tagType}`}
							{...props}>
							{button.tooltip}
						</Tooltip>
					)}>
					<Button
						onClick={() =>
							bbCodeTagFormatter({
								tagType: button.tagType,
								text,
								selectionStart,
								selectionEnd,
								updateText
							})
						}
						size="sm"
						tabIndex={-1}
						variant="dark">
						<FontAwesomeIcon
							icon={button.icon}
							fixedWidth={true}
							style={{ pointerEvents: "none" }}
						/>
					</Button>
				</OverlayTrigger>
			))}
		</div>
	);
};

export default BBCodeFormatButtons;
