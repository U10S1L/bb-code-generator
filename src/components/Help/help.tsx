import React from "react";
import { OverlayTrigger, Button, Card } from "react-bootstrap";
type Props = {
	title: string;
	text: string;
};

const Help = (props: Props) => {
	function htmlText() {
		return { __html: props.text };
	}
	function htmlTitle() {
		return { __html: props.title };
	}

	return (
		<OverlayTrigger
			rootClose
			trigger="click"
			placement="right"
			overlay={
				<Card
					bg="dark"
					text="white"
					style={{
						width: "35%",
						height: "50%",
						overflowY: "auto",
						border: "5px solid gray",
						padding: "1rem",
						zIndex: 9999
					}}>
					<Card.Title dangerouslySetInnerHTML={htmlTitle()} />
					<Card.Body dangerouslySetInnerHTML={htmlText()} />
				</Card>
			}>
			<Button
				variant="success"
				id="help-button"
				style={{
					width: "4rem",
					height: "3rem",
					position: "fixed",
					top: "50%",
					left: "1rem",
					zIndex: 9999,
					fontWeight: "bold"
				}}>
				Help
			</Button>
		</OverlayTrigger>
	);
};

export default Help;
