import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

type QuestionMarkTooltipProps = {
	text: string;
	id: string;
	styles?: React.CSSProperties;
};
type ButtonTooltipProps = {
	buttonLabel: string;
	content: string;
	id: string;
	styles?: React.CSSProperties;
	variant: any;
};
export const QuestionMarkTooltip = ({
	text,
	id,
	styles
}: QuestionMarkTooltipProps) => {
	var tooltipStyles = {
		backgroundColor: "rgba(42, 96, 136, .4)",
		color: "white",
		fontSize: ".9rem",
		width: "1.0rem",
		height: "1.0rem",
		borderRadius: "50%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		lineHeight: "normal",
		marginLeft: "1rem",
		flexShrink: 0,
		...styles
	};

	function htmlText() {
		return { __html: text };
	}
	return (
		<OverlayTrigger
			placement={"auto"}
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

export const ButtonTooltip = ({
	variant,
	content,
	id,
	styles,
	buttonLabel
}: ButtonTooltipProps) => {
	const tooltipStyles = {
		display: "inline",
		...styles
	};
	function htmlContent() {
		return { __html: content };
	}
	function htmlButtonLabel() {
		return { __html: buttonLabel };
	}
	return (
		<OverlayTrigger
			placement={"auto"}
			overlay={
				<Tooltip id={`tooltip-${id}`}>
					<div dangerouslySetInnerHTML={htmlContent()}></div>
				</Tooltip>
			}>
			<Button
				variant={variant}
				style={tooltipStyles}
				dangerouslySetInnerHTML={htmlButtonLabel()}></Button>
		</OverlayTrigger>
	);
};
