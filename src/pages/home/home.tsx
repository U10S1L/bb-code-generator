import "./home.css";

import { Col, Jumbotron, Row } from "react-bootstrap";

import React from "react";

const Home = () => {
	return (
		<>
			<Row
				className="d-none d-lg-flex comparison-image-text-wrapper"
				style={{ marginTop: "1rem" }}>
				<Col>
					<div
						style={{
							writingMode: "vertical-lr",
							transform: "rotate(180deg)",
							marginLeft: "auto",
							fontWeight: "bold",
							fontSize: "3rem"
						}}>
						BEFORE
					</div>
				</Col>
				<Col xs={7} className="comparison-image-wrapper">
					<img
						src="https://i.imgur.com/TnWUslD.png"
						alt="before-shitty-bbcode"
						className="img-fluid "
					/>
				</Col>
				<Col></Col>
			</Row>
			<Row>
				<Jumbotron
					fluid
					style={{
						backgroundColor: "lightgrey",
						flex: "1",
						margin: "1rem 0",
						padding: "2.5rem"
					}}>
					<h2 style={{ textAlign: "center" }}>
						Forms that generate BBCode.
						<br />
						For <b>all</b> your paperwork.
					</h2>
				</Jumbotron>
			</Row>
			<Row className="d-none d-lg-flex comparison-image-text-wrapper">
				<Col></Col>
				<Col xs={7} className="comparison-image-wrapper">
					<img
						src="https://i.imgur.com/oJ3OXF4.png"
						alt="after-nice-bbcodeform"
						className="img-fluid"
					/>
				</Col>
				<Col>
					<div
						style={{
							writingMode: "vertical-lr",
							marginRight: "auto",
							fontWeight: "bold",
							fontSize: "3rem"
						}}>
						AFTER
					</div>
				</Col>
			</Row>
		</>
	);
};

export default Home;
