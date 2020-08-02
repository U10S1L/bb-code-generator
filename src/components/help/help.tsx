import { Button, Card, OverlayTrigger } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

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
						width: "75%",
						height: "75%",
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
				variant="secondary"
				id="help-button"
				style={{
					height: "3rem",
					position: "fixed",
					top: "50%",
					left: "1rem",
					zIndex: 9999,
					fontWeight: "bold"
				}}>
				<span dangerouslySetInnerHTML={htmlTitle()} />{" "}
				<FontAwesomeIcon icon="caret-right" />
			</Button>
		</OverlayTrigger>
	);
};

export default Help;
