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
			placement="left-start"
			overlay={
				<Card
					bg="dark"
					text="white"
					style={{
						position: "fixed",
						width: "50%",
						height: "80%",
						overflowY: "auto",
						border: "5px solid gray",
						padding: "1rem"
					}}>
					<Card.Title dangerouslySetInnerHTML={htmlTitle()} />
					<Card.Body dangerouslySetInnerHTML={htmlText()} />
				</Card>
			}>
			<Button
				variant="info"
				style={{
					position: "fixed",
					bottom: 0,
					right: 0,
					zIndex: 1,
					borderRadius: ".5"
				}}>
				Help
			</Button>
		</OverlayTrigger>
	);
};

export default Help;
