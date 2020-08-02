import { OverlayTrigger, Tooltip } from "react-bootstrap";

import React from "react";

type ShapeTooltipProps = {
	text: string;
	id: string;
	styles?: React.CSSProperties;
};
export const QuestionMarkTooltip = ({
	text,
	id,
	styles
}: ShapeTooltipProps) => {
	var tooltipStyles = {
		backgroundColor: "rgba(42, 96, 136, .4)",
		color: "white",
		fontSize: ".8rem",
		width: "1.0rem",
		height: "1.0rem",
		borderRadius: "50%",
		lineHeight: "normal",
		marginLeft: "1rem",
		display: "flex",
		justifyContent: "center",
		cursor: "pointer",
		...styles
	};

	function htmlText() {
		return { __html: text };
	}
	return (
		<OverlayTrigger
			placement={"top"}
			overlay={
				<Tooltip id={`tooltip-${id}`}>
					<div
						style={{ textAlign: "left" }}
						dangerouslySetInnerHTML={htmlText()}></div>
				</Tooltip>
			}>
			<span style={tooltipStyles}>?</span>
		</OverlayTrigger>
	);
};
