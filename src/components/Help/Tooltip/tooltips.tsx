import React from "react";
import { OverlayTrigger, Tooltip, Button, Card } from "react-bootstrap";

type ShapeTooltipProps = {
	text: string;
	id: string;
	styles?: React.CSSProperties;
};
type ButtonTooltipProps = {
	buttonLabel: string;
	content: JSX.Element;
	id: string;
	styles?: React.CSSProperties;
	variant: any;
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

export const BBCodeVisualizerButton = ({
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
			placement="right"
			rootClose
			trigger="click"
			overlay={
				<Card
					bg="dark"
					text="dark"
					id={`tooltip-${id}`}
					style={{ overflowY: "auto", width: "40%", height: "50%" }}>
					{content}
				</Card>
			}>
			<Button
				variant={variant}
				style={tooltipStyles}
				dangerouslySetInnerHTML={htmlButtonLabel()}></Button>
		</OverlayTrigger>
	);
};
