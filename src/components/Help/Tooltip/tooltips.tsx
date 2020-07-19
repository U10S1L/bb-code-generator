import React from "react";
import { OverlayTrigger, Tooltip, Button, Card } from "react-bootstrap";
import BBCodeVisualizer from "components/Form/Creator/BBCode/Visualizer/bbCodeVisualizer";

type ShapeTooltipProps = {
	text: string;
	id: string;
	styles?: React.CSSProperties;
};
type BBCodeVisualizerTooltipProps = {
	id: string;
	styles?: React.CSSProperties;
	bbCode: string;
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
	id,
	styles,
	bbCode
}: BBCodeVisualizerTooltipProps) => {
	const tooltipStyles = {
		display: "inline",
		...styles
	};

	return (
		<OverlayTrigger
			placement="bottom"
			rootClose
			trigger="click"
			overlay={
				<Card
					bg="dark"
					id={`tooltip-${id}`}
					style={{
						overflowY: "auto",
						width: "40%",
						height: "50%",
						zIndex: 9999
					}}>
					<Card.Body>
						<div style={{ color: "white" }}>Test</div>

						<BBCodeVisualizer bbCode={bbCode} />
					</Card.Body>
				</Card>
			}>
			<Button variant="secondary" style={tooltipStyles}>
				BBCode Visualizer
				{/* <div>
					<FontAwesomeIcon icon="caret-square-down" />
				</div> */}
			</Button>
		</OverlayTrigger>
	);
};
