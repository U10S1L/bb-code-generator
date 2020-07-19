import "./home.css";
import React from "react";
import { Row, Col, Jumbotron } from "react-bootstrap";

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
				<Col xs={8} className="comparison-image-wrapper">
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
					<h3 style={{ textAlign: "center" }}>
						Create (and use) BBCode generator forms.
						<br /> That generate BBCode. For <b> all</b> your paperwork.
					</h3>
				</Jumbotron>
			</Row>
			<Row className="d-none d-lg-flex comparison-image-text-wrapper">
				<Col></Col>
				<Col xs={8} className="comparison-image-wrapper">
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
